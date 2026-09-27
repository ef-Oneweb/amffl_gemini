import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { Listing } from '../../types';
import { StorageService } from '../../services/storageService';

export const ListingsImportManager: React.FC = () => {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Partial<Listing>[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleCsv = `title,description,price,condition,category,category_slug,location_state,location_lga,seller_phone
MF 375 Farm Tractor 75HP,Heavy duty Massey Ferguson tractor ready for work,18500000,Like New,Tractors,vehicles,Kaduna,Kaduna North,+2348023456789
Cassava Flash Dryer 1 Ton/hr,Stainless steel flash dryer for high quality cassava flour,6500000,New,Agricultural Machinery,commercial-equipment,Oyo,Ibadan North,+2348099887766
Solar Borehole Water Pump 3HP,DC submersible deep well solar pump system with 8 panels,2400000,New,Solar & Inverter Systems,electronics,Lagos,Ikorodu,+2348134455667`;

  const handleParse = (textToParse: string) => {
    try {
      setErrorMsg(null);
      const lines = textToParse.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('CSV must contain at least a header line and one data row.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows: Partial<Listing>[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};

        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });

        if (row.title && row.price) {
          rows.push({
            id: `list_csv_${Date.now()}_${i}`,
            title: row.title,
            description: row.description || 'Imported via CSV bulk tool.',
            price: Number(row.price) || 0,
            currency: 'NGN',
            condition: (row.condition || 'New') as any,
            category: row.category || 'Commercial Equipment',
            category_slug: row.category_slug || 'commercial-equipment',
            subcategory: row.category || 'Commercial Equipment',
            family_slug: row.category_slug === 'vehicles' ? 'vehicles' : row.category_slug === 'property' ? 'property' : 'others',
            location_state: row.location_state || 'Lagos',
            location_lga: row.location_lga || 'Ikeja',
            seller_phone: row.seller_phone || '+234 800 000 0000',
            seller_name: 'AMFFL Direct Merchant',
            seller_verified: true,
            seller_tier: 'Enterprise Gold',
            images: [
              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
            ],
            status: 'active',
            is_featured: false,
            negotiable: true,
            created_date: new Date().toISOString(),
          });
        }
      }

      setParsedRows(rows);
    } catch (err: any) {
      setErrorMsg(`Failed to parse CSV: ${err.message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setCsvText(content);
      handleParse(content);
    };
    reader.readAsText(file);
  };

  const handleBulkImport = () => {
    if (parsedRows.length === 0) return;
    parsedRows.forEach((row) => {
      StorageService.saveListing(row as Listing);
    });
    setImportStatus(`Successfully imported ${parsedRows.length} listings to marketplace!`);
    setParsedRows([]);
    setCsvText('');
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
            Bulk CSV Listings Ingestion
          </h3>
          <p className="text-xs text-slate-500">
            Upload or paste CSV listings with direct client-side parsing (replaces legacy extractor)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCsvText(sampleCsv);
            handleParse(sampleCsv);
          }}
          className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Load Sample CSV
        </button>
      </div>

      {/* File Upload Box */}
      <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
        <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <p className="text-xs font-bold text-slate-800">Drag and drop your .csv file here</p>
        <p className="text-[11px] text-slate-500 mt-0.5">Supports comma separated UTF-8 CSV with headers</p>
        <label className="mt-3 inline-block px-4 py-2 rounded-full bg-white border border-slate-300 hover:border-emerald-600 text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-colors">
          Browse Computer
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Or Paste Raw Text */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Or Paste CSV Content Directly:
        </label>
        <textarea
          value={csvText}
          onChange={(e) => {
            setCsvText(e.target.value);
            if (e.target.value.trim()) handleParse(e.target.value);
          }}
          rows={5}
          placeholder="title,description,price,condition,category,category_slug,location_state,location_lga,seller_phone"
          className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {importStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="space-y-3 bg-slate-50 p-4 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              CSV Preview: {parsedRows.length} Valid Rows Ready
            </span>
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-800/20 flex items-center gap-1.5 transition-all"
            >
              <span>Import All {parsedRows.length} Rows</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price (₦)</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 font-semibold text-slate-900">{row.title}</td>
                    <td className="p-2 text-slate-600">{row.category}</td>
                    <td className="p-2 font-bold text-emerald-700">₦{row.price?.toLocaleString()}</td>
                    <td className="p-2 text-slate-500">{row.location_lga}, {row.location_state}</td>
                    <td className="p-2">{row.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
