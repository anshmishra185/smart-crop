import { useState } from 'react'
import {
  ShieldCheck,
  Droplets,
  MapPin,
  Phone,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Award,
  Truck,
} from 'lucide-react'
import type { CropListing } from '../../data/marketplaceCrops'
import { FarmerDirectContactPopover } from './FarmerDirectContactPopover'

interface CropListingCardProps {
  listing: CropListing
  onBuyNow: (listing: CropListing) => void
}

export function CropListingCard({ listing, onBuyNow }: CropListingCardProps) {
  const [showLabSpecs, setShowLabSpecs] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const premiumOverMsp = listing.pricePerQuintal - listing.mspBenchmark
  const isAboveMsp = premiumOverMsp >= 0

  return (
    <>
      <div className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/95">
        {/* Card Media Header */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img
            src={listing.imageUrl}
            alt={listing.cropName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20" />

          {/* Top Badges: Quality & Moisture */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="rounded-lg bg-amber-500/95 px-2.5 py-1 text-[10px] font-black uppercase text-slate-950 shadow-md">
              {listing.qualityGrade}
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-slate-950/85 px-2 py-1 text-[10px] font-bold text-emerald-400 backdrop-blur-md border border-white/10 shadow-md">
              <Droplets className="h-3 w-3" />
              <span>{listing.moisturePercentage}% Moisture</span>
            </span>
          </div>

          {/* Bottom Overlay Badges: Category & APMC Verified */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
            <span className="rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-md border border-white/10">
              {listing.category}
            </span>
            {listing.verifiedAPMC && (
              <span className="flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <ShieldCheck className="h-3 w-3" /> APMC Verified
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-amber-500 transition line-clamp-1 dark:text-white">
                  {listing.cropName}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {listing.cropNamePa}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {listing.variety.split(' ')[0]}
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed dark:text-slate-400">
              {listing.description}
            </p>

            {/* Farmer Micro-Profile Pill */}
            <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950 text-xs">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 truncate">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {listing.farmerName}
                  </p>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                    <span>Verified Kisaan</span>
                  </span>
                </div>
                <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  <MapPin className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>
                    {listing.village}, {listing.district}
                  </span>
                </p>
              </div>

              {/* Quick Contact Action Button */}
              <button
                onClick={() => setShowContactModal(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 cursor-pointer"
                title="Contact Farmer Directly"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>

            {/* Expandable Agronomic Lab Specs Drawer */}
            {listing.labSpecs && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowLabSpecs(!showLabSpecs)}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
                >
                  <span className="flex items-center gap-1.5">
                    <FlaskConical className="h-3.5 w-3.5 text-amber-500" />
                    <span>Agronomic Lab Quality Specs</span>
                  </span>
                  {showLabSpecs ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {showLabSpecs && (
                  <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 text-[11px] animate-in fade-in duration-200">
                    {listing.labSpecs.proteinPercent !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Protein:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {listing.labSpecs.proteinPercent}%
                        </span>
                      </div>
                    )}
                    {listing.labSpecs.grainLengthMm !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Length:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {listing.labSpecs.grainLengthMm} mm
                        </span>
                      </div>
                    )}
                    {listing.labSpecs.oilContentPercent !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Oil Content:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {listing.labSpecs.oilContentPercent}%
                        </span>
                      </div>
                    )}
                    {listing.labSpecs.germinationRate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Germination:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {listing.labSpecs.germinationRate}%
                        </span>
                      </div>
                    )}
                    {listing.labSpecs.foreignMatterPercent !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Foreign Matter:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {listing.labSpecs.foreignMatterPercent}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price, MSP Delta, and Buy Trigger */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Farmer Asking Rate
                </span>
                <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                  ₹{listing.pricePerQuintal.toLocaleString()}
                  <span className="text-xs font-semibold text-slate-400 ml-1">/ Qtl</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Total Lot Available
                </span>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {listing.quantityQuintals} Quintals
                </p>
              </div>
            </div>

            {/* MSP Comparison & Delivery Mode */}
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">
                MSP Floor: ₹{listing.mspBenchmark}
              </span>
              <span
                className={`inline-flex items-center gap-1 font-bold rounded-full px-2 py-0.5 ${
                  isAboveMsp
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                }`}
              >
                <Award className="h-3 w-3" />
                {isAboveMsp
                  ? `+₹${premiumOverMsp} Above Govt MSP`
                  : `-₹${Math.abs(premiumOverMsp)} Below MSP`}
              </span>
            </div>

            {/* Delivery Tag */}
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Truck className="h-3 w-3 text-amber-500" />
              <span>{listing.deliveryOptions[0]}</span>
            </div>

            {/* Buy Trigger */}
            <button
              onClick={() => onBuyNow(listing)}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 py-3 text-xs font-black text-white shadow-lg transition hover:from-amber-500 hover:to-amber-600 hover:text-slate-950 active:scale-95 dark:from-white dark:to-slate-100 dark:text-slate-950 dark:hover:from-amber-400 dark:hover:to-amber-500 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Buy Lot with Escrow / COD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct Contact Modal */}
      {showContactModal && (
        <FarmerDirectContactPopover
          listing={listing}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  )
}

