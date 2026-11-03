import {
  PackageCheck,
  Share2,
  X,
  Printer,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ConfirmedOrder } from '../../data/marketplaceCrops'

interface MandiInvoiceModalProps {
  order: ConfirmedOrder
  onClose: () => void
}

export function MandiInvoiceModal({ order, onClose }: MandiInvoiceModalProps) {
  const isRazorpay = order.paymentMethod === 'razorpay'

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    const text = `Krishi Saarthi Mandi Order Confirmation:
Order ID: ${order.orderId}
Commodity: ${order.cropName} (${order.variety})
Volume: ${order.quantityQuintals} Quintals
Total Value: ₹${order.grandTotal.toLocaleString()}
Delivery Weighbridge: ${order.buyerMandiYard}
Delivery Handshake OTP: ${order.deliveryOtp}`

    if (navigator.share) {
      navigator.share({ title: 'Mandi Order Invoice', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Order summary copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-xl overflow-hidden rounded-3xl border border-emerald-500/40 bg-slate-950 p-6 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <PackageCheck className="h-7 w-7" />
          </div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-black uppercase text-emerald-300">
            Order Confirmed &amp; Dispatched to Logistics
          </span>
          <h3 className="text-xl font-black text-white">APMC Mandi Tax Invoice &amp; Bill of Supply</h3>
          <p className="font-mono text-xs text-slate-400">Order ID: {order.orderId}</p>
        </div>

        {/* Printable Invoice Container */}
        <div className="mt-5 overflow-y-auto space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-xs font-sans">
          {/* Commodity & Volume */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Commodity Trade Lot</span>
              <p className="text-sm font-black text-white">{order.cropName}</p>
              <p className="text-[11px] text-emerald-400 font-semibold">{order.variety}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gross Volume</span>
              <p className="font-mono text-base font-black text-white">{order.quantityQuintals} Quintals</p>
              <p className="text-[10px] text-slate-400">~{(order.quantityQuintals * 0.1).toFixed(1)} Metric Tons</p>
            </div>
          </div>

          {/* Farmer & Buyer KYC */}
          <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Seller / Farmer</span>
              <p className="font-bold text-white">{order.farmerName}</p>
              <p className="text-[11px] text-slate-300">{order.farmerLocation}</p>
              <p className="font-mono text-[10px] text-slate-400">{order.farmerPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Buyer / Consignee</span>
              <p className="font-bold text-white">{order.buyerName}</p>
              <p className="text-[11px] text-slate-300">{order.buyerAddress}</p>
              <p className="font-mono text-[10px] text-slate-400">{order.buyerPhone}</p>
            </div>
          </div>

          {/* Logistics & Delivery Weighbridge */}
          <div className="border-b border-white/10 pb-3 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Designated Mandi Weighbridge</span>
            <p className="font-bold text-white">{order.buyerMandiYard}</p>
          </div>

          {/* Gateway Status & Weighment OTP */}
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
              <p className="text-[9px] text-slate-300">Share with driver upon electronic slip generation</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-1.5 pt-1">
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

        {/* Action Toolbar */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
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
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-slate-950 hover:bg-amber-400 transition cursor-pointer shadow-lg shadow-amber-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
