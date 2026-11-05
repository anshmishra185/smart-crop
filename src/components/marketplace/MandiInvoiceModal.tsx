import { useState } from 'react'
import {
  PackageCheck,
  Share2,
  X,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react'
import { toast } from 'sonner'
import type { ConfirmedOrder } from '../../data/marketplaceCrops'

interface MandiInvoiceModalProps {
  order: ConfirmedOrder
  onClose: () => void
}

export function MandiInvoiceModal({ order, onClose }: MandiInvoiceModalProps) {
  const [activeTab, setActiveTab] = useState<'invoice' | 'enam'>('invoice')
  const isRazorpay = order.paymentMethod === 'razorpay'

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    const text = `Krishi Saarthi Mandi Order & e-NAM Gate Pass:
Order ID: ${order.orderId}
e-NAM Pass: eNAM-PB-${order.orderId.slice(-6)}
Commodity: ${order.cropName} (${order.variety})
Volume: ${order.quantityQuintals} Quintals
Total Value: ₹${order.grandTotal.toLocaleString()}
APMC Yard: ${order.buyerMandiYard}
Delivery Handshake OTP: ${order.deliveryOtp}`

    if (navigator.share) {
      navigator.share({ title: 'Mandi Order Invoice', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Order & e-NAM pass summary copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab Switcher: Invoice vs e-NAM Gate Pass */}
        <div className="mx-auto flex rounded-2xl bg-white/10 p-1 text-xs font-bold mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('invoice')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 transition ${
              activeTab === 'invoice'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Mandi Tax Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('enam')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 transition ${
              activeTab === 'enam'
                ? 'bg-amber-500 text-slate-950 shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Official e-NAM Gate Pass</span>
          </button>
        </div>

        {/* VIEW 1: MANDI TAX INVOICE */}
        {activeTab === 'invoice' ? (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <PackageCheck className="h-6 w-6" />
              </div>
              <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-black uppercase text-emerald-300">
                Order Confirmed &amp; Dispatched to Logistics
              </span>
              <h3 className="text-lg font-black text-white">APMC Mandi Tax Invoice &amp; Bill of Supply</h3>
              <p className="font-mono text-xs text-slate-400">Order ID: {order.orderId}</p>
            </div>

            {/* Invoice Metadata */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Buyer</span>
                  <p className="font-bold text-white">{order.buyerName}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{order.buyerPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Seller / Farmer</span>
                  <p className="font-bold text-emerald-400">{order.farmerName}</p>
                  <p className="text-slate-400">{order.farmerLocation || 'Punjab'}</p>
                </div>
              </div>

              {/* Commodity Specs */}
              <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Crop Commodity</span>
                  <p className="font-bold text-white text-sm">{order.cropName}</p>
                  <p className="text-slate-400">{order.variety}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Procurement Volume</span>
                  <p className="font-mono text-lg font-black text-white">{order.quantityQuintals} Quintals</p>
                  <p className="text-slate-400 font-mono">₹{order.pricePerQuintal.toLocaleString()} / Qtl</p>
                </div>
              </div>

              {/* Settlement & Handshake OTP */}
              <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-3 items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Settlement Method</span>
                  <p className="font-bold text-emerald-400 uppercase">
                    {isRazorpay ? 'Razorpay Agri-Escrow' : 'Cash on Delivery (COD)'}
                  </p>
                  <p className="font-mono text-[10px] text-slate-400 truncate">
                    Ref: {order.razorpayPaymentId}
                  </p>
                </div>

                <div className="text-right rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5">
                  <span className="text-[10px] uppercase font-bold text-amber-300">Weighment Handshake OTP</span>
                  <p className="font-mono text-xl font-black text-amber-400">{order.deliveryOtp}</p>
                  <p className="text-[9px] text-slate-300">Share with driver upon physical gate delivery</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-slate-400">
                  <span>Lot Base Price:</span>
                  <span className="font-mono">₹{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>APMC Mandi Fee (1.5%):</span>
                  <span className="font-mono">₹{order.mandiFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Rural Development Fund (1.5% RDF):</span>
                  <span className="font-mono">₹{order.rdfTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Freight Logistics:</span>
                  <span className="font-mono">₹{order.logisticsFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-baseline text-sm font-black text-emerald-400">
                  <span>Total Settled Amount:</span>
                  <span className="font-mono text-xl">₹{order.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: OFFICIAL e-NAM MANDI GATE PASS */
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="rounded-2xl border-2 border-dashed border-amber-500/60 bg-amber-950/20 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-black text-white">e-NAM APMC GATE ENTRY PASS</h4>
                    <p className="text-[10px] text-amber-300 uppercase font-bold">
                      National Agriculture Market · Punjab Mandi Board
                    </p>
                  </div>
                </div>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-300 border border-emerald-500/40">
                  PASSED WEIGHMENT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Gate Pass Number</span>
                  <p className="font-mono font-black text-amber-300 text-sm">
                    eNAM-PB-{order.orderId.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Designated APMC Yard</span>
                  <p className="font-bold text-white">{order.buyerMandiYard}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-3 text-center border border-white/10">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Quality Grade</span>
                  <p className="font-bold text-emerald-400">Grade A+</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Moisture Index</span>
                  <p className="font-bold text-white">11.4% (Pass)</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Net Weight</span>
                  <p className="font-mono font-black text-amber-300">{order.quantityQuintals} Qtl</p>
                </div>
              </div>

              {/* QR Verification Barcode Simulation */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-white p-1 text-slate-950 flex items-center justify-center">
                    <QrCode className="h-12 w-12" />
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-mono font-bold text-white">TOKEN: QR-eNAM-{order.orderId.slice(-6)}</p>
                    <p className="text-[10px] text-slate-400">Authorized for APMC Gate Sensor Scan</p>
                    <span className="mt-0.5 inline-block text-[9px] text-emerald-400 font-bold">
                      ✓ Cryptographically Signed &amp; Audited
                    </span>
                  </div>
                </div>
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print {activeTab === 'enam' ? 'Gate Pass' : 'Invoice'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition cursor-pointer shadow-lg shadow-emerald-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
