import { useState } from 'react'
import {
  PackageCheck,
  Leaf,
  Scale,
  AlertCircle,
  TrendingDown,
  Coins
} from 'lucide-react'

export interface InventoryItem {
  name: string
  category: 'Fertilizer' | 'Agrochemical' | 'Diesel'
  openingStock: number
  unit: string
  procured: number
  appliedToField: number
  closingStock: number
  icarNormLimit: number
  unitCost: number
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    name: 'Neem-Coated Urea (46% N)',
    category: 'Fertilizer',
    openingStock: 40,
    unit: 'Bags (45kg)',
    procured: 50,
    appliedToField: 62,
    closingStock: 28,
    icarNormLimit: 65,
    unitCost: 266,
  },
  {
    name: 'Di-Ammonium Phosphate (DAP 18:46:0)',
    category: 'Fertilizer',
    openingStock: 25,
    unit: 'Bags (50kg)',
    procured: 30,
    appliedToField: 36,
    closingStock: 19,
    icarNormLimit: 40,
    unitCost: 1350,
  },
  {
    name: 'Muriate of Potash (MOP 60% K2O)',
    category: 'Fertilizer',
    openingStock: 15,
    unit: 'Bags (50kg)',
    procured: 20,
    appliedToField: 22,
    closingStock: 13,
    icarNormLimit: 25,
    unitCost: 1700,
  },
  {
    name: 'Mancozeb 75% WP (Indofil M-45)',
    category: 'Agrochemical',
    openingStock: 12,
    unit: 'kg',
    procured: 20,
    appliedToField: 18,
    closingStock: 14,
    icarNormLimit: 22,
    unitCost: 450,
  },
  {
    name: 'High-Speed Farm Diesel (HSD)',
    category: 'Diesel',
    openingStock: 450,
    unit: 'Litres',
    procured: 800,
    appliedToField: 710,
    closingStock: 540,
    icarNormLimit: 750,
    unitCost: 89,
  },
]

export function InputMaterialLedger() {
  const [items] = useState<InventoryItem[]>(INVENTORY_DATA)

  // Calculations for Carbon Offsets
  // Direct Seeded Rice (DSR) saves ~35% methane + reduced diesel
  // Moong green manuring fixes 35-40 kg N / ha
  const dieselConsumptionLitres = items.find((i) => i.category === 'Diesel')?.appliedToField || 710
  const fossilDieselCo2Tons = Number(((dieselConsumptionLitres * 2.68) / 1000).toFixed(2)) // 2.68 kg CO2 per L diesel
  const syntheticNAppliedKg = 62 * 45 * 0.46 // Urea kg * 46% N = ~1283 kg N
  const n2oEmissionsCo2Tons = Number(((syntheticNAppliedKg * 0.01 * 298 * (44 / 28)) / 1000).toFixed(2))

  // Carbon credits generated: DSR (8.5 acres * 1.8 tCO2e) + Green manure (6.5 acres * 0.8 tCO2e)
  const carbonCreditsEarnedTons = Number((8.5 * 1.8 + 6.5 * 0.8).toFixed(1)) // ~20.5 tCO2e
  const carbonCreditValueInr = Math.round(carbonCreditsEarnedTons * 1250) // ₹1,250 / tCO2e

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
            <PackageCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Audited Ag-Input Inventory &amp; Mass Balance
              </span>
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-950/80 dark:text-teal-300">
                ESG Carbon Accounting
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Input Material Balance Ledger &amp; Carbon Offset Accounting
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Inventory Status:</span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            100% Reconciled
          </span>
        </div>
      </div>

      {/* Carbon Offset Cards */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-agri-darkBorder dark:bg-agri-darkCard">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Scope 1 Ag Emissions
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {(fossilDieselCo2Tons + n2oEmissionsCo2Tons).toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-500">tCO₂e</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Diesel ({fossilDieselCo2Tons}t) + N₂O Soil Outgassing ({n2oEmissionsCo2Tons}t).
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Verified Carbon Offsets
            </span>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-800 dark:text-emerald-300">
              +{carbonCreditsEarnedTons}
            </span>
            <span className="text-xs font-bold text-emerald-600">tCO₂e Sequestered</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Earned via Direct Seeded Rice (DSR) &amp; Legume stubble incorporation.
          </p>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 dark:border-teal-900/40 dark:bg-teal-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Carbon Credit Market Yield
            </span>
            <Coins className="h-4 w-4 text-teal-600" />
          </div>
          <p className="mt-1 text-xl font-black text-teal-800 dark:text-teal-300">
            ₹{carbonCreditValueInr.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Trading at ₹1,250 / tCO₂e on voluntary agricultural carbon registry.
          </p>
        </div>
      </div>

      {/* Audited Inventory Ledger Table */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            Audited Material Mass Balance &amp; POP Overuse Check
          </span>
          <span className="text-[11px] text-slate-400">ICAR Ludhiana Package of Practices Benchmark</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
              <tr>
                <th className="p-2.5">Input Material</th>
                <th className="p-2.5">Opening</th>
                <th className="p-2.5">Procured</th>
                <th className="p-2.5">Applied</th>
                <th className="p-2.5">Stock Left</th>
                <th className="p-2.5">POP Limit</th>
                <th className="p-2.5">Reconciliation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
              {items.map((item, idx) => {
                const isOverused = item.appliedToField > item.icarNormLimit
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                      {item.name}
                      <span className="ml-1.5 text-[10px] text-slate-400 font-normal">({item.unit})</span>
                    </td>
                    <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">{item.openingStock}</td>
                    <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">+{item.procured}</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                      {item.appliedToField}
                    </td>
                    <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.closingStock}
                    </td>
                    <td className="p-2.5 font-mono text-slate-500">{item.icarNormLimit}</td>
                    <td className="p-2.5">
                      {isOverused ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <AlertCircle className="h-3 w-3" /> Overuse Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          <TrendingDown className="h-3 w-3" /> Within ICAR Quota
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

