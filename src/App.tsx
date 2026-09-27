import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MembershipLayout } from './layouts/MembershipLayout';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { MembershipHome } from './pages/MembershipHome';
import { MembershipFamilyPage } from './pages/MembershipFamilyPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { CreateListingPage } from './pages/CreateListingPage';
import { VerificationPage } from './pages/VerificationPage';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Layout Routes */}
        <Route element={<MembershipLayout />}>
          <Route path="/" element={<MarketplacePage />} />
          <Route path="/marketplace" element={<Navigate to="/" replace />} />
          <Route path="/marketplace/:id" element={<ListingDetailPage />} />
          <Route path="/premium-services" element={<MembershipHome />} />
          <Route path="/membership/:family" element={<MembershipFamilyPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/sell" element={<CreateListingPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
