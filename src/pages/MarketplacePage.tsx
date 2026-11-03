import { useState, useEffect } from 'react'
import { PlusCircle, ShieldCheck, Store, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { ModuleAnimatedLogo } from '../components/common/ModuleAnimatedLogo'
import {
  INITIAL_CROP_LISTINGS,
  type CropListing,
  type ConfirmedOrder,
} from '../data/marketplaceCrops'
import { MandiRateTicker } from '../components/marketplace/MandiRateTicker'
import { MarketplaceFilters } from '../components/marketplace/MarketplaceFilters'
import { CropListingCard } from '../components/marketplace/CropListingCard'
import { SellCropModal } from '../components/marketplace/SellCropModal'
import { CheckoutTerminalModal } from '../components/marketplace/CheckoutTerminalModal'
import { MandiInvoiceModal } from '../components/marketplace/MandiInvoiceModal'

const STORAGE_KEY = 'crop_doctor_marketplace_listings'

export function MarketplacePage() {
  // Load listings from localStorage or fallback to initial dataset
  const [listings, setListings] = useState<CropListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // fallback
    }
    return INITIAL_CROP_LISTINGS
  })

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All')
  const [selectedGrade, setSelectedGrade] = useState<string>('All')
  const [aboveMspOnly, setAboveMspOnly] = useState<boolean>(false)

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [checkoutListing, setCheckoutListing] = useState<CropListing | null>(null)
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null)

  // Save to localStorage when listings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(listings))
    } catch {
      // localStorage failure
    }
  }, [listings])

  // Filter Logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cropNamePa.includes(searchQuery) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory

    const matchesDistrict =
      selectedDistrict === 'All' || item.district === selectedDistrict

    const matchesGrade =
      selectedGrade === 'All' || item.qualityGrade === selectedGrade

    const matchesMsp = !aboveMspOnly || item.pricePerQuintal >= item.mspBenchmark

    return matchesSearch && matchesCategory && matchesDistrict && matchesGrade && matchesMsp
  })

  // Handlers
  const handlePublishListing = (newListing: CropListing) => {
    setListings([newListing, ...listings])
    setIsSellModalOpen(false)
    toast.success('Crop Lot Published to Mandi Marketplace!', {
      description: `${newListing.quantityQuintals} Quintals of ${newListing.variety} is now live for verified millers.`,
    })
  }

  const handleOrderSuccess = (order: ConfirmedOrder) => {
    setCheckoutListing(null)
    setConfirmedOrder(order)
    toast.success(
      order.paymentMethod === 'razorpay'
        ? 'Payment Secured in Razorpay Agri-Escrow!'
        : 'Cash on Delivery Mandi Order Confirmed!',
      {
        description: `Order ${order.orderId} generated. OTP: ${order.deliveryOtp}`,
      }
    )
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedDistrict('All')
    setSelectedGrade('All')
    setAboveMspOnly(false)
  }

  // Calculate live volume
  const totalVolume = listings.reduce((acc, l) => acc + l.quantityQuintals, 0)

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner with 21st.dev Animated Logo & Live Badges */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-forest-950/60 to-slate-900 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ModuleAnimatedLogo
              module="marketplace"
              size="hero"
              showLabel={false}
              showTelemetryBeacon={true}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-300 border border-amber-500/30">
                  APMC Mandi &amp; e-NAM Integrated B2B Exchange
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Razorpay Agri-Escrow 100% Protected</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Crop Mandi Direct Marketplace
              </h1>
              <p className="text-sm font-semibold text-emerald-300 max-w-2xl mt-0.5">
                ਸਿੱਧੀ ਫਸਲ ਮੰਡੀ — Direct trading between verified Punjab farmers, food processors, and millers with Zero Middleman Cut.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Sell My Crop (ਫਸਲ ਵੇਚੋ)</span>
            </button>
          </div>
        </div>

        {/* Live Marketplace KPI Badges */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-4 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Listed Volume</span>
            <p className="text-base font-black text-white mt-0.5 font-mono">
              {totalVolume.toLocaleString()} Quintals
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-slate-400">Govt MSP Benchmark Floor</span>
            <p className="text-base font-black text-emerald-400 mt-0.5 font-mono">₹2,275 / Qtl (Wheat)</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-slate-400">Settlement Gateways</span>
            <p className="text-base font-black text-amber-300 mt-0.5">Razorpay Escrow &amp; COD</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <span className="text-[10px] uppercase font-bold text-slate-400">Mandi Payout Settlement</span>
            <p className="text-base font-black text-white mt-0.5">T+1 Post Weighbridge</p>
          </div>
        </div>
      </div>

      {/* 2. Official Punjab Mandi Board Live Rates Ticker */}
      <MandiRateTicker onSelectCrop={(cropName) => setSearchQuery(cropName)} />

      {/* 3. Search & Multi-Filter Control Terminal */}
      <MarketplaceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        aboveMspOnly={aboveMspOnly}
        setAboveMspOnly={setAboveMspOnly}
        totalCount={filteredListings.length}
      />

      {/* 4. Active Crop Lot Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <CropListingCard
              key={item.id}
              listing={item}
              onBuyNow={(lot) => setCheckoutListing(lot)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Store className="h-7 w-7" />
          </div>
          <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
            No Crop Lots Found Matching Filters
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Try resetting your search query, selecting &quot;All Districts&quot;, or relaxing the &quot;Above Govt MSP&quot; filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* 5. MODAL: SELL MY CROP (ਫਸਲ ਵੇਚੋ) */}
      {isSellModalOpen && (
        <SellCropModal
          onClose={() => setIsSellModalOpen(false)}
          onPublish={handlePublishListing}
        />
      )}

      {/* 6. MODAL: DUAL GATEWAY CHECKOUT (RAZORPAY ESCROW & COD) */}
      {checkoutListing && (
        <CheckoutTerminalModal
          listing={checkoutListing}
          onClose={() => setCheckoutListing(null)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* 7. MODAL: MANDI TAX INVOICE & BILL OF SUPPLY */}
      {confirmedOrder && (
        <MandiInvoiceModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  )
}
