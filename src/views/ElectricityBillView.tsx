import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ElectricityProvider, ElectricityBill, BillPaymentRecord } from '../types';
import { 
  Zap, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  CreditCard, 
  Receipt, 
  Sparkles, 
  Leaf, 
  Smartphone, 
  Building, 
  RotateCcw
} from 'lucide-react';

export const ElectricityBillView: React.FC = () => {
  const { user, awardPoints, deductPoints, showToast } = useApp();

  const [providers, setProviders] = useState<ElectricityProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('bescom');
  const [consumerNumber, setConsumerNumber] = useState<string>('BESCOM-99281');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [billData, setBillData] = useState<ElectricityBill | null>(null);

  // Redemption state
  const [redeemPoints, setRedeemPoints] = useState<number>(100);
  const [usePoints, setUsePoints] = useState<boolean>(true);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<BillPaymentRecord | null>(null);

  // History
  const [transactions, setTransactions] = useState<BillPaymentRecord[]>([]);

  useEffect(() => {
    fetchProviders();
    fetchTransactions();
    handleFetchBill('BESCOM-99281', 'bescom');
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/electricity/providers');
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/electricity/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleFetchBill = async (numToFetch = consumerNumber, provId = selectedProviderId) => {
    if (!numToFetch.trim()) {
      showToast('Please enter your consumer number / CA number', 'info');
      return;
    }

    setIsFetching(true);
    setPaymentSuccessReceipt(null);

    try {
      const res = await fetch('/api/electricity/fetch-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumerNumber: numToFetch.trim(),
          providerId: provId
        })
      });

      if (res.ok) {
        const bill = await res.json();
        setBillData(bill);
        const maxAffordable = Math.min(user?.ecoPoints || 400, Math.floor(bill.billAmount));
        setRedeemPoints(Math.min(100, maxAffordable));
      } else {
        showToast('Unable to find bill details for this consumer ID', 'error');
      }
    } catch (err) {
      console.error('Error fetching bill:', err);
      showToast('Error connecting to electricity billing network', 'error');
    } finally {
      setIsFetching(false);
    }
  };

  const calculateDiscount = () => {
    if (!usePoints || !billData) return 0;
    return Math.round(redeemPoints * 0.50);
  };

  const getPayableAmount = () => {
    if (!billData) return 0;
    return Math.max(billData.billAmount - calculateDiscount(), 0);
  };

  const handleProcessPayment = async () => {
    if (!billData) return;

    if (billData.isPaid) {
      showToast('This bill has already been marked as paid!', 'info');
      return;
    }

    const pointsToDeduct = usePoints ? redeemPoints : 0;
    if (pointsToDeduct > (user?.ecoPoints || 0)) {
      showToast('Insufficient Eco Points balance', 'error');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const res = await fetch('/api/electricity/pay-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billId: billData.id,
          providerId: billData.providerId,
          consumerNumber: billData.consumerNumber,
          redeemedEcoPoints: pointsToDeduct,
          paymentMethod: paymentMethod
        })
      });

      if (res.ok) {
        const receipt: BillPaymentRecord = await res.json();
        setPaymentSuccessReceipt(receipt);
        setBillData((prev) => prev ? { ...prev, isPaid: true } : null);

        if (pointsToDeduct > 0) {
          deductPoints(pointsToDeduct, `Redeemed on Electricity Bill (${receipt.providerName})`);
        }

        awardPoints(receipt.ecoPointsAwarded, `Cashback bonus for paying ${receipt.providerName} electricity bill`);
        fetchTransactions();
        showToast('Electricity bill successfully paid with Eco Points discount!', 'success');
      } else {
        showToast('Payment gateway failed. Please retry.', 'error');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      showToast('Payment system timeout. Please retry.', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="py-10 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 text-emerald-800 border border-white/80 text-xs font-black uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Govt BBPS Integrated • Eco Cashback System</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 font-sans tracking-tight drop-shadow-md">
            Pay Electricity Bill with Eco Points
          </h1>

          <p className="text-base font-semibold text-emerald-50/90 mt-2 max-w-2xl mx-auto leading-relaxed drop-shadow-xs">
            Convert your earned recycling points into direct cash discounts on your municipal power bill. <strong className="text-white underline decoration-emerald-400 font-black">1 Eco Point = ₹0.50 Bill Rebate</strong>!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Provider Selection & CA Input */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div>
                <h2 className="text-lg font-black text-[#063B32] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>Select Electricity Board (DISCOM)</span>
                </h2>
                <p className="text-xs text-[#365A52] font-semibold mt-0.5">
                  Supporting BESCOM, TATA Power, MESCOM, Adani, BSES & nationwide providers.
                </p>
              </div>

              {/* Provider Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {providers.map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => {
                      setSelectedProviderId(prov.id);
                      setConsumerNumber(prov.sampleConsumerNumber);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      selectedProviderId === prov.id
                        ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white/80 border-emerald-100 hover:bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase text-[#365A52] block">
                        {prov.state}
                      </span>
                      <h4 className="text-xs font-black text-[#063B32] line-clamp-1 mt-0.5">
                        {prov.name}
                      </h4>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold mt-2">
                      {prov.sampleConsumerNumber}
                    </span>
                  </button>
                ))}
              </div>

              {/* Consumer Number Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-[#063B32] uppercase tracking-wider">
                  Consumer Account / CA Number:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={consumerNumber}
                      onChange={(e) => setConsumerNumber(e.target.value)}
                      placeholder="e.g. BESCOM-99281"
                      className="w-full pl-4 pr-4 py-3 rounded-2xl bg-white border border-emerald-200 text-[#063B32] text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                    />
                  </div>
                  <button
                    disabled={isFetching}
                    onClick={() => handleFetchBill(consumerNumber, selectedProviderId)}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-2 shrink-0 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isFetching ? (
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                        <span>Fetching...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5" />
                        <span>Fetch Bill</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Sample Consumer Numbers */}
              <div className="pt-2">
                <p className="text-[11px] font-black text-[#365A52] uppercase tracking-wider mb-2">
                  Quick Demo Accounts (1-Click Test):
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConsumerNumber('BESCOM-99281');
                      setSelectedProviderId('bescom');
                      handleFetchBill('BESCOM-99281', 'bescom');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#063B32] text-xs font-mono font-bold border border-emerald-200 transition-colors"
                  >
                    ⚡ BESCOM-99281 (Puneeth)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConsumerNumber('TATA-88123');
                      setSelectedProviderId('tatapower');
                      handleFetchBill('TATA-88123', 'tatapower');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#063B32] text-xs font-mono font-bold border border-emerald-200 transition-colors"
                  >
                    🔋 TATA-88123 (Ananya)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConsumerNumber('MESCOM-44810');
                      setSelectedProviderId('mescom');
                      handleFetchBill('MESCOM-44810', 'mescom');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#063B32] text-xs font-mono font-bold border border-emerald-200 transition-colors"
                  >
                    ⚡ MESCOM-44810 (Rahul)
                  </button>
                </div>
              </div>

            </div>

            {/* Environmental Energy Footprint Insights */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-black flex items-center gap-2 text-[#063B32]">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>Green Power & Carbon Awareness</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="glass-subcard p-4 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="text-[#365A52] uppercase text-[10px] font-black">Estimated Carbon Footprint</div>
                  <div className="text-xl font-black text-amber-600 font-mono">
                    ~{billData ? billData.carbonFootprintKg : 180} kg CO2e
                  </div>
                  <p className="text-[#365A52] font-semibold text-[11px] leading-snug">
                    Generated from {billData ? billData.unitsConsumedKwh : 220} kWh grid consumption.
                  </p>
                </div>

                <div className="glass-subcard p-4 rounded-2xl border border-emerald-100 space-y-1">
                  <div className="text-[#365A52] uppercase text-[10px] font-black">Eco Subsidy Rate</div>
                  <div className="text-xl font-black text-emerald-700 font-mono">
                    1 Pt = ₹0.50 OFF
                  </div>
                  <p className="text-[#365A52] font-semibold text-[11px] leading-snug">
                    Offset your electricity bills with points earned from segregating waste and reporting pollution.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Bill Breakdown & Payment Processing */}
          <div className="lg:col-span-6 space-y-6">

            {/* Success Receipt Card */}
            {paymentSuccessReceipt && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in duration-300 border-2 border-emerald-400">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-2xl font-black shadow-md">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">BBPS Authorization Complete</span>
                      <h3 className="text-xl font-black font-mono">Payment Successful</h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/20 text-white text-xs font-black">
                    PAID ⚡
                  </span>
                </div>

                <div className="glass-subcard p-5 rounded-2xl border border-emerald-100 space-y-3 font-mono text-xs text-[#063B32]">
                  <div className="flex justify-between border-b border-emerald-100 pb-2">
                    <span className="text-[#365A52] font-semibold">Transaction ID:</span>
                    <span className="font-bold">{paymentSuccessReceipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 pb-2">
                    <span className="text-[#365A52] font-semibold">BBPS Reference:</span>
                    <span className="font-bold">{paymentSuccessReceipt.bbpsReference}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 pb-2">
                    <span className="text-[#365A52] font-semibold">Consumer:</span>
                    <span className="font-bold">{paymentSuccessReceipt.consumerName} ({paymentSuccessReceipt.consumerNumber})</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 pb-2">
                    <span className="text-[#365A52] font-semibold">Provider:</span>
                    <span className="font-bold">{paymentSuccessReceipt.providerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-100 pb-2">
                    <span className="text-[#365A52] font-semibold">Eco Points Redeemed:</span>
                    <span className="font-bold text-amber-600">-{paymentSuccessReceipt.ecoPointsRedeemed} Pts (-₹{paymentSuccessReceipt.discountAmount})</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-black">
                    <span>Amount Paid:</span>
                    <span className="text-emerald-700">₹{paymentSuccessReceipt.finalAmountPaid}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Bonus Earned: <strong className="font-black">+{paymentSuccessReceipt.ecoPointsAwarded} Eco Points</strong></span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 px-2 py-0.5 rounded">
                    Added to Wallet
                  </span>
                </div>

                <button
                  onClick={() => setPaymentSuccessReceipt(null)}
                  className="w-full py-3 rounded-2xl bg-[#063B32] text-white font-bold text-xs hover:bg-[#063B32]/90 transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            )}

            {/* Bill Details & Payment Section */}
            {billData && !paymentSuccessReceipt && (
              <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
                
                {/* Header Info */}
                <div className="flex items-start justify-between border-b border-emerald-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      {billData.providerName}
                    </span>
                    <h3 className="text-xl font-black text-[#063B32] mt-0.5">
                      {billData.consumerName}
                    </h3>
                    <p className="text-xs text-[#365A52] font-mono">
                      CA: {billData.consumerNumber} • Month: {billData.billingMonth}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#365A52] uppercase">Due Date</span>
                    <p className="text-xs font-black text-amber-600">
                      {billData.dueDate}
                    </p>
                    {billData.isPaid ? (
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        PAID ✓
                      </span>
                    ) : (
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                        UNPAID
                      </span>
                    )}
                  </div>
                </div>

                {/* Units & Tariff Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#365A52] font-semibold">
                    <span>Power Consumption:</span>
                    <span className="font-bold text-[#063B32] font-mono">{billData.unitsConsumedKwh} kWh Units</span>
                  </div>
                  <div className="flex justify-between text-[#365A52] font-semibold">
                    <span>Energy Charges:</span>
                    <span className="font-bold text-[#063B32] font-mono">₹{billData.energyCharges}</span>
                  </div>
                  <div className="flex justify-between text-[#365A52] font-semibold">
                    <span>Fixed Meter Rent:</span>
                    <span className="font-bold text-[#063B32] font-mono">₹{billData.fixedCharges}</span>
                  </div>
                  <div className="flex justify-between text-[#365A52] font-semibold">
                    <span>Green Energy Cess:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹{billData.greenCessCharges}</span>
                  </div>
                  <div className="flex justify-between text-[#365A52] font-semibold">
                    <span>Government Duty:</span>
                    <span className="font-bold text-[#063B32] font-mono">₹{billData.taxes}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-100 text-sm font-black text-[#063B32]">
                    <span>Total Gross Bill:</span>
                    <span className="font-mono">₹{billData.billAmount}</span>
                  </div>
                </div>

                {/* Eco Points Discount Slider & Toggle */}
                {!billData.isPaid && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-black text-[#063B32]">
                          Redeem Eco Points for Bill Subsidy
                        </span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setUsePoints(!usePoints)}
                        className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
                          usePoints ? 'bg-amber-500 text-white' : 'bg-white text-[#063B32] border border-amber-200'
                        }`}
                      >
                        {usePoints ? 'Applied ✓' : 'Apply Points'}
                      </button>
                    </div>

                    {usePoints && (
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-xs font-bold text-[#365A52]">
                          <span>Redeem Points: <strong className="text-amber-700 font-mono">{redeemPoints} Pts</strong></span>
                          <span className="text-emerald-700 font-black font-mono">-₹{calculateDiscount()} Discount</span>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={Math.min(user?.ecoPoints || 400, Math.floor(billData.billAmount))}
                          step={10}
                          value={redeemPoints}
                          onChange={(e) => setRedeemPoints(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />

                        <div className="flex justify-between text-[10px] text-[#365A52] font-mono font-bold">
                          <span>0 Pts</span>
                          <span>Max: {Math.min(user?.ecoPoints || 400, Math.floor(billData.billAmount))} Pts</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Final Checkout Bar */}
                {!billData.isPaid ? (
                  <div className="space-y-4">
                    
                    <div>
                      <label className="block text-xs font-black text-[#063B32] uppercase tracking-wider mb-2">
                        Payment Method:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi')}
                          className={`p-3 rounded-2xl border text-center transition-all text-xs font-black flex flex-col items-center gap-1 ${
                            paymentMethod === 'upi'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                              : 'bg-white/80 border-emerald-100 text-[#063B32]'
                          }`}
                        >
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <span>UPI / QR</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('cards')}
                          className={`p-3 rounded-2xl border text-center transition-all text-xs font-black flex flex-col items-center gap-1 ${
                            paymentMethod === 'cards'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                              : 'bg-white/80 border-emerald-100 text-[#063B32]'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>Cards</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('netbanking')}
                          className={`p-3 rounded-2xl border text-center transition-all text-xs font-black flex flex-col items-center gap-1 ${
                            paymentMethod === 'netbanking'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                              : 'bg-white/80 border-emerald-100 text-[#063B32]'
                          }`}
                        >
                          <Building className="w-4 h-4 text-emerald-600" />
                          <span>NetBanking</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        disabled={isProcessingPayment}
                        onClick={handleProcessPayment}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <span className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 animate-spin" />
                            <span>Processing BBPS Payment...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>Pay Net ₹{getPayableAmount()}</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>This electricity bill has been fully settled.</span>
                  </div>
                )}

              </div>
            )}

            {/* Transactions History Card */}
            <div className="glass-panel rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#063B32] flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-500" />
                  <span>Recent Electricity Bill Payments</span>
                </h3>
                <span className="text-xs text-[#365A52] font-black">
                  {transactions.length} Records
                </span>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-[#365A52] font-semibold text-center py-4">
                  No payment transactions logged yet. Pay your bill above to see receipts.
                </p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {transactions.map((tx) => (
                    <div
                      key={tx.transactionId}
                      className="p-3.5 rounded-2xl glass-subcard border border-emerald-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#063B32]">
                            ₹{tx.finalAmountPaid}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {tx.paymentStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#365A52] font-semibold mt-0.5">
                          {tx.providerName} • CA: {tx.consumerNumber}
                        </p>
                        <p className="text-[10px] text-[#365A52] font-mono">
                          {tx.paidAt} • {tx.bbpsReference}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        {tx.discountAmount > 0 && (
                          <span className="block text-[10px] text-amber-700 font-black font-mono">
                            -₹{tx.discountAmount} Pts
                          </span>
                        )}
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black font-mono">
                          +{tx.ecoPointsAwarded} Pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
