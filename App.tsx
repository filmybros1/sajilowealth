
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import SliderInput from './components/SliderInput';
import { calculateSIP, formatCurrency } from './utils/calculations';
import { getFinancialAdvice } from './services/geminiService';
import { SIPInputs, InvestmentFrequency } from './types';

const Logo = () => (
  <div className="relative w-11 h-11 flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl rotate-6 shadow-lg shadow-emerald-200 opacity-20 group-hover:rotate-12 transition-transform"></div>
    <div className="relative w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 overflow-hidden">
      <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28C12 28 14.5 25.5 18 25.5C21.5 25.5 24 28 28 28C32 28 32 23 32 23" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 20C8 20 10.5 17.5 14 17.5C17.5 17.5 20 20 24 20C28 20 28 15 28 15" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5"/>
        <path d="M22 12L32 12L32 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="32" cy="12" r="2" fill="white" />
      </svg>
    </div>
  </div>
);

const App: React.FC = () => {
  const [inputs, setInputs] = useState<SIPInputs>({
    monthlyInvestment: 10000,
    expectedReturnRate: 14,
    timePeriod: 15,
    frequency: 'monthly'
  });

  const [activeTab, setActiveTab] = useState<'chart' | 'schedule'>('chart');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const results = useMemo(() => calculateSIP(inputs), [inputs]);

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getFinancialAdvice(inputs, results);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const updateInput = (key: keyof SIPInputs, val: any) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    // Slight delay to ensure any layout calculations or state updates resolve
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 font-['Plus_Jakarta_Sans'] text-slate-900">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          .no-print { display: none !important; }
          body { background: white !important; }
          .main-content { padding: 0 !important; width: 100% !important; max-width: 100% !important; }
          .lg\\:col-span-8 { width: 100% !important; flex: none !important; }
          .printable-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
          .chart-container { height: 300px !important; margin-bottom: 2rem; }
          .timeline-container { display: block !important; max-height: none !important; overflow: visible !important; }
          .print-header { display: block !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th { background: #f8fafc !important; color: #64748b !important; padding: 12px 8px !important; border-bottom: 2px solid #e2e8f0 !important; font-size: 9px !important; }
          td { padding: 8px !important; border-bottom: 1px solid #f1f5f9 !important; font-size: 10px !important; }
          .advisor-section { page-break-before: always; border: 1px solid #f1f5f9 !important; margin-top: 2rem; }
          .stats-grid { display: grid !important; grid-template-cols: repeat(3, 1fr) !important; gap: 1rem !important; margin-bottom: 2rem; }
        }
        .print-header { display: none; }
      `}</style>

      {/* Navigation - Hidden in PDF */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative z-50 no-print">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <Logo />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none uppercase">SajiloWealth</h1>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Smart Capital Management</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Analytics Engine v2.5</span>
        </div>
      </nav>

      {/* PDF Exclusive Report Header */}
      <div className="print-header px-4 mb-8">
        <div className="flex justify-between items-center border-b-4 border-emerald-600 pb-8">
          <div className="flex items-center gap-4">
             <Logo />
             <div>
               <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Investment Forecast</h1>
               <p className="text-slate-500 font-bold text-xs">A comprehensive SIP audit by SajiloWealth</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Report Date</p>
             <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('en-NP', { dateStyle: 'long' })}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mt-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SIP Configuration</p>
              <p className="text-sm font-black text-slate-900">{formatCurrency(inputs.monthlyInvestment)} / {inputs.frequency}</p>
           </div>
           <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expectation</p>
              <p className="text-sm font-black text-slate-900">{inputs.expectedReturnRate}% Annual Yield</p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Investment Window</p>
              <p className="text-sm font-black text-slate-900">{inputs.timePeriod} Years</p>
           </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-4 main-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Controls - Left Panel (Hidden in PDF) */}
          <div className="lg:col-span-4 no-print">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm sticky top-10">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">SIP Calculator</h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Refine your plan</p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                   <i className="fas fa-calculator text-emerald-600 text-sm"></i>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Deposit Frequency</label>
                  <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {(['monthly', 'quarterly', 'yearly'] as InvestmentFrequency[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => updateInput('frequency', f)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${inputs.frequency === f ? 'bg-white text-emerald-600 border border-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {f.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <SliderInput 
                  label="Investment Amount"
                  value={inputs.monthlyInvestment}
                  min={500} max={1000000} step={500}
                  prefix="रू "
                  onChange={(v) => updateInput('monthlyInvestment', v)}
                />

                <SliderInput 
                  label="Expected Return (Annual)"
                  value={inputs.expectedReturnRate}
                  min={1} max={40} step={0.1}
                  unit="%"
                  onChange={(v) => updateInput('expectedReturnRate', v)}
                />

                <SliderInput 
                  label="Investment Period"
                  value={inputs.timePeriod}
                  min={1} max={50} step={1}
                  unit=" Years"
                  onChange={(v) => updateInput('timePeriod', v)}
                />
              </div>

              <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Compounding Power</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  At {inputs.expectedReturnRate}%, your money doubles roughly every {Math.round(72/inputs.expectedReturnRate)} years. Time in the market beats timing the market.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Rapid Stats Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stats-grid">
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm printable-card">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Invested</p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">{formatCurrency(results.totalInvested)}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm printable-card">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Wealth Gained</p>
                <p className="text-2xl font-black text-emerald-600 tracking-tight">+{formatCurrency(results.estimatedReturns)}</p>
              </div>
              <div className="bg-emerald-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-100 printable-card">
                <div className="absolute top-0 right-0 p-4 opacity-10 no-print">
                  <i className="fas fa-chart-line text-5xl"></i>
                </div>
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Future Value</p>
                <p className="text-2xl font-black tracking-tight">{formatCurrency(results.totalValue)}</p>
              </div>
            </div>

            {/* Content Display Card */}
            <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm printable-card">
              <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 no-print">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <i className="fas fa-layer-group text-emerald-600 text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm tracking-tight uppercase">Plan Analytics</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Forecast</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex p-1 bg-slate-100 rounded-2xl mr-2">
                    <button 
                      onClick={() => setActiveTab('chart')}
                      className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'chart' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Graph
                    </button>
                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Timeline
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="flex items-center gap-3 px-6 h-11 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all active:scale-95 text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 disabled:opacity-50"
                  >
                    <i className={`fas ${isExporting ? 'fa-circle-notch animate-spin' : 'fa-file-pdf'} text-xs text-emerald-400`}></i>
                    <span>{isExporting ? 'Formatting...' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>

              <div className="p-8">
                {/* Graph View - Always visible in PDF if chart is current or if explicitly printing */}
                <div className={`${activeTab === 'chart' ? 'block' : 'hidden print:block'} chart-container`}>
                   <div className="hidden print:block mb-4">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Appreciation Curve</h3>
                   </div>
                   <div className="h-[420px] print:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.growthData}>
                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `रू ${(v/100000).toFixed(0)}L`} />
                        <Tooltip 
                          contentStyle={{ border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', padding: '16px' }}
                          itemStyle={{ fontWeight: 900, fontSize: '13px', color: '#10b981' }}
                          formatter={(v: any) => [formatCurrency(v), 'Projected Value']}
                        />
                        <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fill="url(#growthGrad)" animationDuration={1000} />
                        <Area type="monotone" dataKey="invested" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Timeline Table View - Always full expanded in PDF */}
                <div className={`${activeTab === 'schedule' ? 'block' : 'hidden print:block'} timeline-container print:mt-12`}>
                  <div className="hidden print:block mb-6 border-b border-slate-100 pb-2">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Amortization Schedule</h3>
                  </div>
                  <div className="max-h-[500px] print:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 print:static">
                        <tr className="text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100">
                          <th className="py-5 px-4">Period</th>
                          <th className="py-5 px-4">Investment</th>
                          <th className="py-5 px-4">Periodic Return</th>
                          <th className="py-5 px-4 text-right">Net Assets</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row) => (
                          <tr key={row.period} className="hover:bg-slate-50 border-b border-slate-50 transition-colors group print:break-inside-avoid">
                            <td className="py-4 px-4 text-[11px] font-bold text-slate-500">{row.label}</td>
                            <td className="py-4 px-4 text-xs font-semibold text-slate-700">{formatCurrency(row.investmentAmount)}</td>
                            <td className="py-4 px-4 text-xs font-bold text-emerald-500">+{formatCurrency(row.periodicReturn)}</td>
                            <td className="py-4 px-4 text-xs font-black text-slate-900 text-right group-hover:text-emerald-600 transition-colors">{formatCurrency(row.estimatedValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Advisor Section */}
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-sm overflow-hidden printable-card advisor-section">
               <div className="bg-slate-900 px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 print:bg-slate-50">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-[1.5rem] flex items-center justify-center border border-emerald-500/20 print:bg-emerald-100">
                      <i className="fas fa-microchip text-emerald-400 text-2xl print:text-emerald-600"></i>
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-black tracking-tight uppercase print:text-slate-900">AI Wealth Advisor</h3>
                      <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest print:text-emerald-600">Smart Market Analysis</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGetAdvice}
                    disabled={loadingAdvice}
                    className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl transition-all disabled:opacity-50 text-[10px] uppercase tracking-widest hover:bg-emerald-500 active:scale-95 shadow-2xl shadow-emerald-900/50 no-print"
                  >
                    {loadingAdvice ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                    Analyze My Plan
                  </button>
               </div>
               <div className="p-10">
                  <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 min-h-[160px] relative print:border-none print:p-0">
                    {advice ? (
                      <div className="prose prose-slate prose-sm max-w-none">
                        <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-sm print:text-[11px]">{advice}</div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 print:hidden">
                        <i className="fas fa-brain text-slate-300 text-4xl mb-4"></i>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request AI analysis for localized Nepalese insights</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-50 mt-12 no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
               <Logo />
             </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">SajiloWealth © 2025</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Smart Financial Planning for Nepal</p>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-emerald-600 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
