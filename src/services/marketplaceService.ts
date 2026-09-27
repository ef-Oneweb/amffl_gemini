import { Listing, FilterState, Review } from '../types';
import { StorageService } from './storageService';

// Mapping tier badges to tier numbers 0 - 8
function getSellerTierLevel(tierBadge?: string): number {
  if (!tierBadge) return 0;
  const lower = tierBadge.toLowerCase();
  if (lower.includes('enterprise deluxe') || lower.includes('enterprise supreme')) return 8;
  if (lower.includes('enterprise elite')) return 7;
  if (lower.includes('enterprise gold') || lower.includes('prime developer')) return 6;
  if (lower.includes('diamond elite')) return 5;
  if (lower.includes('diamond gold') || lower.includes('diamond')) return 4;
  if (lower.includes('vip gold')) return 3;
  if (lower.includes('vip') || lower.includes('pro realtor')) return 2;
  if (lower.includes('premium')) return 1;
  return 0;
}

export function computeReviewTrust(sellerId: string, reviews: Review[]): number {
  const sellerReviews = reviews.filter(r => r.seller_id === sellerId && r.status === 'published');
  if (sellerReviews.length < 3) return 0;
  const avg = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
  return Math.round((avg - 3) * 8);
}

export function calculateListingRank(listing: Listing, allReviews: Review[]): number {
  // 1. Promo boost
  let promoBoost = 0;
  if (listing.promotion_type && listing.promotion_expiry_date) {
    const notExpired = new Date(listing.promotion_expiry_date) > new Date();
    if (notExpired) {
      if (listing.promotion_type === 'top_rank') promoBoost = 200;
      else if (listing.promotion_type === 'urgent') promoBoost = 160;
      else if (listing.promotion_type === 'featured') promoBoost = 120;
      else if (listing.promotion_type === 'bump_up') promoBoost = 60;
    }
  }

  // 2. Seller Tier: tier * 10
  const sellerTierLevel = getSellerTierLevel(listing.seller_tier);
  const tierScore = sellerTierLevel * 10;

  // 3. Verified score: +25
  const verifiedScore = listing.seller_verified ? 25 : 0;

  // 4. Review trust: if >= 3 published reviews: (avg - 3) * 8
  const reviewScore = computeReviewTrust(listing.user_id, allReviews);

  // 5. Recency: max(0, 15 - ageDays * 2)
  const ageInDays = Math.max(0, (Date.now() - new Date(listing.created_date).getTime()) / (1000 * 60 * 60 * 24));
  const recencyScore = Math.max(0, 15 - Math.floor(ageInDays) * 2);

  return promoBoost + tierScore + verifiedScore + reviewScore + recencyScore;
}

export interface BrowseResult {
  listings: Listing[];
  total: number;
  hasMore: boolean;
  minPrice: number;
  maxPrice: number;
  categoryCounts: Record<string, number>;
}

export const MarketplaceService = {
  browse(filter: FilterState, offset: number = 0, limit: number = 18): BrowseResult {
    const rawListings = StorageService.getListings().filter(l => l.status === 'active');
    const allReviews = StorageService.getReviews();

    // Calculate category counts
    const categoryCounts: Record<string, number> = {};
    for (const item of rawListings) {
      const slug = item.category_slug;
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
    }

    // Determine min and max prices
    let minPrice = Infinity;
    let maxPrice = 0;
    for (const item of rawListings) {
      if (item.price < minPrice) minPrice = item.price;
      if (item.price > maxPrice) maxPrice = item.price;
    }
    if (minPrice === Infinity) minPrice = 0;

    // Filter listings
    let filtered = rawListings.filter(item => {
      // Category slug match
      if (filter.category_slug && filter.category_slug !== 'all') {
        if (item.category_slug !== filter.category_slug) return false;
      }
      // Subcategory / specific category match
      if (filter.category && filter.category !== 'all') {
        if (item.category !== filter.category && item.subcategory !== filter.category) return false;
      }
      // State match
      if (filter.state && filter.state !== 'all') {
        if (item.location_state.toLowerCase() !== filter.state.toLowerCase()) return false;
      }
      // LGA match
      if (filter.lga && filter.lga !== 'all') {
        if (!item.location_lga.toLowerCase().includes(filter.lga.toLowerCase())) return false;
      }
      // Condition match
      if (filter.condition && filter.condition !== 'all') {
        if (item.condition.toLowerCase() !== filter.condition.toLowerCase()) return false;
      }
      // Price range
      if (filter.min_price !== undefined && item.price < filter.min_price) return false;
      if (filter.max_price !== undefined && item.price > filter.max_price) return false;
      // Search query (keyword in title, description, category, or subcategory)
      if (filter.q && filter.q.trim()) {
        const q = filter.q.toLowerCase().trim();
        const matches = 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.subcategory && item.subcategory.toLowerCase().includes(q)) ||
          item.location_state.toLowerCase().includes(q) ||
          item.location_lga.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    // Score each listing
    const scoredListings = filtered.map(l => ({
      ...l,
      computed_rank: calculateListingRank(l, allReviews)
    }));

    // Sort listings
    scoredListings.sort((a, b) => {
      const sort = filter.sort || 'recommended';
      if (sort === 'newest') {
        const timeDiff = new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        if (timeDiff !== 0) return timeDiff;
        return (b.computed_rank || 0) - (a.computed_rank || 0);
      }
      if (sort === 'price_asc') {
        const priceDiff = a.price - b.price;
        if (priceDiff !== 0) return priceDiff;
        return (b.computed_rank || 0) - (a.computed_rank || 0);
      }
      if (sort === 'price_desc') {
        const priceDiff = b.price - a.price;
        if (priceDiff !== 0) return priceDiff;
        return (b.computed_rank || 0) - (a.computed_rank || 0);
      }
      // Default: recommended ranking
      const rankDiff = (b.computed_rank || 0) - (a.computed_rank || 0);
      if (rankDiff !== 0) return rankDiff;
      return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    });

    const total = scoredListings.length;
    const paginated = scoredListings.slice(0, offset + limit);
    const hasMore = offset + limit < total;

    return {
      listings: paginated,
      total,
      hasMore,
      minPrice,
      maxPrice,
      categoryCounts
    };
  },

  getRecommendedListings(limit = 8): Listing[] {
    const listings = StorageService.getListings().filter(l => l.status === 'active');
    const allReviews = StorageService.getReviews();
    return listings
      .map(l => ({ ...l, computed_rank: calculateListingRank(l, allReviews) }))
      .sort((a, b) => (b.computed_rank || 0) - (a.computed_rank || 0))
      .slice(0, limit);
  },

  getListingById(id: string): Listing | undefined {
    return StorageService.getListings().find(l => l.id === id);
  },

  recordContactReveal(id: string): void {
    const listing = this.getListingById(id);
    if (listing) {
      listing.contact_reveals = (listing.contact_reveals || 0) + 1;
      StorageService.saveListing(listing);
    }
  },

  recordView(id: string): void {
    const listing = this.getListingById(id);
    if (listing) {
      listing.views_count = (listing.views_count || 0) + 1;
      StorageService.saveListing(listing);
    }
  }
};
