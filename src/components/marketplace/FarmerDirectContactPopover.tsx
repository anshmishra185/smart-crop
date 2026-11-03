import { Phone, MessageSquare, MapPin, ExternalLink, X, ShieldCheck } from 'lucide-react'
import type { CropListing } from '../../data/marketplaceCrops'

interface FarmerDirectContactPopoverProps {
  listing: CropListing
  onClose: () => void
}

export function FarmerDirectContactPopover({ listing, onClose }: FarmerDirectContactPopoverProps) {
  const whatsappUrl = `https://wa.me/${listing.farmerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Sat Sri Akal / Hello ${listing.farmerName}, I saw your crop lot for ${listing.cropName} (${listing.variety}, ${listing.quantityQuintals} Quintals) on Krishi Saarthi Mandi Marketplace. I would like to discuss purchase terms.`
  )}`

  const mapsUrl = listing.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${listing.coordinates.lat},${listing.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${listing.village}, ${listing.district}, Punjab`)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 p-5 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Farmer Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-lg shadow-lg">
            {listing.farmerName.charAt(listing.farmerName.startsWith('S. ') ? 3 : 0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-white">{listing.farmerName}</h3>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-400 font-semibold">APMC Punjab Registered Farmer</p>
          </div>
        </div>

        {/* Location & Crop Meta */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs space-y-2">
          <div className="flex items-start gap-2 text-slate-300">
            <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">{listing.village}, {listing.district}, Punjab</p>
              <p className="text-[11px] text-slate-400">Farm-gate loading &amp; APMC yard delivery available</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Active Crop:</span>
            <span className="font-bold text-amber-300">{listing.variety} ({listing.quantityQuintals} Qtl)</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="mt-4 space-y-2">
          {/* Phone Call */}
          <a
            href={`tel:${listing.farmerPhone}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
          >
            <Phone className="h-4 w-4" />
            <span>Call Farmer Directly ({listing.farmerPhone})</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Map Link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View Farm Gate GPS Location</span>
          </a>
        </div>
      </div>
    </div>
  )
}

