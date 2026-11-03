import { useState } from 'react'
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react'
import type { CropListing, ConfirmedOrder } from '../../data/marketplaceCrops'

interface CheckoutTerminalModalProps {
  listing: CropListing
  onClose: () => void
  onSuccess: (order: ConfirmedOrder) => void
}

const MANDI_WEIGHBRIDGES = [
  'Khanna Central APMC Weighbridge (Gate #2)',
  'Bhagtanwala APMC Mandi Weighbridge (Amritsar)',
  'Bathinda Cotton Exchange Weighbridge',
  'Fazilka Grain Exchange Weighbridge',
  'Moga New Mandi Weighbridge (Gate #1)',
  'Direct Farm-Gate Weighment (Digital Scale)',
]

export function CheckoutTerminalModal({ listing, onClose, onSuccess }: CheckoutTerminalModalProps) {
  const [quantity, setQuantity] = useState<number>(Math.min(25, listing.quantityQuintals))
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerMandiYard, setBuyerMandiYard] = useState(MANDI_WEIGHBRIDGES[0])
  const [buyerAddress, setBuyerAddress] = useState('')

  // Payment Gateway Selection
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')
  const [razorpayChannel, setRazorpayChannel] = useState<'upi' | 'netbanking' | 'card'>('upi')
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay')
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)')
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892')
  const [showQrCode, setShowQrCode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Bill Calculations
  const subtotal = quantity * listing.pricePerQuintal
  const mandiFee = Math.round(subtotal * 0.015) // 1.5% APMC Mandi Fee
  const rdfTax = Math.round(subtotal * 0.015) // 1.5% Rural Development Fund
  const logisticsFee = quantity * 45 // ₹45 per Quintal
  const grandTotal = subtotal + mandiFee + rdfTax + logisticsFee

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)

      const confirmed: ConfirmedOrder = {
        orderId: `AGRI-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        razorpayPaymentId:
          paymentMethod === 'razorpay'
            ? `pay_rcp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            : 'COD_ON_WEIGHMENT',
        deliveryOtp: Math.floor(100000 + Math.random() * 900000),
        cropName: listing.cropName,
        variety: listing.variety,
        farmerName: listing.farmerName,
        farmerPhone: listing.farmerPhone,
        farmerLocation: `${listing.village}, ${listing.district}, Punjab`,
        buyerName: buyerName.trim() || 'Satluj Agro Millers Ltd.',
        buyerPhone: buyerPhone.trim() || '+91 98111-22334',
        buyerAddress: buyerAddress.trim() || 'Gate #3 Weighbridge, Godown #12',
        buyerMandiYard,
        quantityQuintals: quantity,
        pricePerQuintal: listing.pricePerQuintal,
        subtotal,
        mandiFee,
        rdfTax,
        logisticsFee,
        grandTotal,
        paymentMethod,
        timestamp: new Date().toLocaleString(),
      }

      onSuccess(confirmed)
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Dual Gateway Terminal
                </span>
                <span className="text-xs text-amber-400 font-semibold">{listing.variety}</span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">Settle Mandi Order</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleExecutePayment} className="overflow-y-auto p-6 space-y-5">
          {/* 1. Lot Quantity Selector */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Purchase Quantity (Quintals)</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Available: {listing.quantityQuintals} Qtl
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={listing.minOrderQuintals}
                max={listing.quantityQuintals}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="rounded-xl bg-amber-400 px-3.5 py-1 font-mono text-sm font-black text-slate-950 shrink-0">
                {quantity} Qtl
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Min order limit: {listing.minOrderQuintals} Quintals (~{(listing.minOrderQuintals * 0.1).toFixed(1)} Metric Tons)
            </p>
          </div>

          {/* 2. Buyer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">Buyer Business / Miller Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Ludhiana Roller Flour Mills"
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-300">Mobile Phone Number</label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="+91 98111-22334"
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-300">APMC Mandi Weighbridge Destination</label>
              <select
                value={buyerMandiYard}
                onChange={(e) => setBuyerMandiYard(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400 cursor-pointer"
              >
                {MANDI_WEIGHBRIDGES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-300">Specific Unloading Godown / Gate</label>
              <input
                type="text"
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="Gate #3 Weighbridge, Shed #14"
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          {/* 3. DUAL PAYMENT GATEWAY SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300">
              Select Settlement Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Razorpay Agri-Escrow */}
              <div
                onClick={() => setPaymentMethod('razorpay')}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  paymentMethod === 'razorpay'
                    ? 'border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-400'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Razorpay Agri-Escrow</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-300">
                    INSTANT UPI &amp; NETBANKING
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-300 leading-snug">
                  100% Escrow Guarantee. Funds locked until Mandi weighbridge slip approval.
                </p>
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  paymentMethod === 'cod'
                    ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Cash on Delivery (COD)</span>
                  </div>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[9px] font-black text-amber-300">
                    0% ADVANCE
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-300 leading-snug">
                  Pay upon grain weighment at Mandi yard. 6-digit cryptographic OTP handshake.
                </p>
              </div>
            </div>

            {/* Razorpay Interactive Sub-Channels */}
            {paymentMethod === 'razorpay' && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300">Razorpay Payment Instrument:</span>
                  <div className="flex rounded-lg bg-slate-900 p-0.5 border border-white/10 text-[11px]">
                    {(['upi', 'netbanking', 'card'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setRazorpayChannel(ch)}
                        className={`rounded-md px-2.5 py-1 font-bold transition uppercase ${
                          razorpayChannel === ch
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Channel 1: UPI */}
                {razorpayChannel === 'upi' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {(['gpay', 'phonepe', 'paytm', 'bhim'] as const).map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`rounded-xl border p-2 text-center text-xs font-bold transition uppercase ${
                            selectedUpiApp === app
                              ? 'border-emerald-400 bg-emerald-500/20 text-white font-black'
                              : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>{showQrCode ? 'Hide Mandi UPI QR Code' : 'Display Mandi Escrow QR Code'}</span>
                      </button>

                      <span className="text-[11px] text-slate-400">
                        VPA: <strong className="text-emerald-400">krishisaarthi@razorpay</strong>
                      </span>
                    </div>

                    {showQrCode && (
                      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4 text-slate-950 animate-in zoom-in-95 duration-200">
                        <div className="h-32 w-32 rounded-xl border-4 border-slate-950 p-1 flex items-center justify-center">
                          <QrCode className="h-28 w-28 text-slate-950" />
                        </div>
                        <p className="mt-2 font-mono text-xs font-black">₹{grandTotal.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-600">Scan via GPay, PhonePe, or BHIM</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-Channel 2: NetBanking */}
                {razorpayChannel === 'netbanking' && (
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-300">Select Direct Agricultural Bank:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option>State Bank of India (SBI Agri Gateway)</option>
                      <option>Punjab National Bank (PNB Mandi Portal)</option>
                      <option>HDFC Bank Corporate Exchange</option>
                      <option>ICICI Bank Agro-Business</option>
                      <option>Bank of Baroda e-NAM Integration</option>
                    </select>
                  </div>
                )}

                {/* Sub-Channel 3: Agri-Cards */}
                {razorpayChannel === 'card' && (
                  <div className="space-y-2 text-xs">
                    <label className="text-[11px] text-slate-300">Kisan Credit Card / Corporate Agri-Debit:</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 p-2 text-white font-mono outline-none focus:border-emerald-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Itemized Bill Breakdown */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Commodity Base Lot ({quantity} Qtl × ₹{listing.pricePerQuintal}):</span>
              <span className="font-mono font-bold text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Punjab APMC Mandi Development Fee (1.5%):</span>
              <span className="font-mono">₹{mandiFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rural Development Fund (1.5% RDF):</span>
              <span className="font-mono">₹{rdfTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Heavy Freight Logistics (+₹45/Qtl):</span>
              <span className="font-mono">₹{logisticsFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-baseline text-sm font-black text-emerald-400">
              <span>Total Payable Value:</span>
              <span className="font-mono text-xl">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Authorizing Gateway...</span>
                </>
              ) : paymentMethod === 'razorpay' ? (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Authorize Razorpay Escrow (₹{grandTotal.toLocaleString()})</span>
                </>
              ) : (
                <>
                  <Banknote className="h-4 w-4" />
                  <span>Confirm Cash on Delivery Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
