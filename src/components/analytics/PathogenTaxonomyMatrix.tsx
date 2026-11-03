import { useState } from 'react'
import {
  Dna,
} from 'lucide-react'

interface TaxonomyClass {
  id: string
  name: string
  phylum: string
  sharePct: number
  keyExamples: string[]
  transmissionVector: string
  morphology: string
  sprayResponse: string
}

const TAXONOMY_CLASSES: TaxonomyClass[] = [
  {
    id: 'fungal',
    name: 'Higher Fungi (Ascomycota & Basidiomycota)',
    phylum: 'Dikarya / Eumycota',
    sharePct: 58,
    keyExamples: ['Early Blight (Alternaria solani)', 'Yellow Rust (Puccinia striiformis)', 'Rice Blast (Magnaporthe)'],
    transmissionVector: 'Wind-borne airborne conidia & urediniospores',
    morphology: 'Septate hyphae with melanin-pigmented conidiophores',
    sprayResponse: 'Triazoles (FRAC 3) & Strobilurins (FRAC 11) offer high curative response.',
  },
  {
    id: 'oomycete',
    name: 'Oomycetes (Chromista / Water Molds)',
    phylum: 'Heterokontophyta (Non-fungal stramenopiles)',
    sharePct: 22,
    keyExamples: ['Late Blight (Phytophthora infestans)', 'Downy Mildew (Pseudoperonospora)'],
    transmissionVector: 'Free water droplets, rain splash & motile biflagellate zoospores',
    morphology: 'Coenocytic aseptate hyphae with cellulose cell walls (no chitin)',
    sprayResponse: 'Requires specialist Oomyceticides (Metalaxyl FRAC 4, Dimethomorph, Cymoxanil).',
  },
  {
    id: 'bacterial',
    name: 'Phytopathogenic Bacteria (Gram-Negative)',
    phylum: 'Pseudomonadota (Proteobacteria)',
    sharePct: 12,
    keyExamples: ['Bacterial Leaf Blight (Xanthomonas oryzae)', 'Bacterial Spot (X. campestris)'],
    transmissionVector: 'Hydathodes, stomata, pruning wounds & storm rain splashing',
    morphology: 'Single-celled rod bacilli with polar flagella & extracellular xanthan slime',
    sprayResponse: 'Copper Oxychloride 50% WP + Streptocycline antibiotic plant bath.',
  },
  {
    id: 'viral',
    name: 'Plant Viruses & Insect Vectors',
    phylum: 'Riboviria & Geminiviridae',
    sharePct: 8,
    keyExamples: ['Cotton Leaf Curl Virus (CLCuD)', 'Tomato Yellow Leaf Curl Virus (TYLCV)'],
    transmissionVector: 'Insect vectors: Silverleaf Whitefly (Bemisia tabaci) & Aphids',
    morphology: 'Circular single-stranded DNA genome enclosed in twinned icosahedral capsids',
    sprayResponse: 'No chemical cure. Must control vector with systemic Thiamethoxam or neem oil.',
  },
]

export function PathogenTaxonomyMatrix() {
  const [selectedId, setSelectedId] = useState<string>('fungal')

  const activeClass = TAXONOMY_CLASSES.find((t) => t.id === selectedId) || TAXONOMY_CLASSES[0]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
            <Dna className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Multi-Class Pathogen Taxonomy & Etiological Composition
            </h3>
            <p className="text-[11px] text-slate-500">
              Taxonomic classification of active estate pathogens: Eumycota, Oomycota, Proteobacteria & Geminiviridae
            </p>
          </div>
        </div>

        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          ICAR Laboratory Classified
        </span>
      </div>

      {/* Category Grid */}
      <div className="grid gap-2 sm:grid-cols-4">
        {TAXONOMY_CLASSES.map((item) => {
          const isSelected = item.id === selectedId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`rounded-2xl border p-3.5 text-left transition ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 shadow-xs dark:border-teal-500 dark:bg-teal-950/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-agri-darkBorder dark:bg-agri-darkCard'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {item.id.toUpperCase()}
                </span>
                <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-400">
                  {item.sharePct}%
                </span>
              </div>
              <h5 className="mt-1 text-xs font-black text-slate-900 dark:text-white truncate">
                {item.name.split(' ')[0]} {item.name.split(' ')[1]}
              </h5>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {item.phylum.split(' ')[0]}
              </p>
            </button>
          )
        })}
      </div>

      {/* Selected Class Deep-Dive */}
      <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-950 dark:bg-teal-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-teal-200/60 pb-3 dark:border-teal-900/50">
          <div>
            <h4 className="text-base font-black text-teal-950 dark:text-teal-100">
              {activeClass.name}
            </h4>
            <p className="text-xs text-teal-900/80 dark:text-teal-200/80 mt-0.5">
              Phylum: <strong>{activeClass.phylum}</strong> • Share: <strong>{activeClass.sharePct}% of estate infections</strong>
            </p>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-teal-100 dark:border-agri-darkBorder">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Transmission Vector & Dispersal
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeClass.transmissionVector}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-teal-100 dark:border-agri-darkBorder">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Cellular Morphology
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeClass.morphology}
            </p>
          </div>

          <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-teal-100 dark:border-agri-darkBorder">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Curative Chemistry Response
            </span>
            <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {activeClass.sprayResponse}
            </p>
          </div>
        </div>

        {/* Key Examples List */}
        <div className="rounded-xl bg-white p-3 dark:bg-agri-darkCard border border-teal-100 dark:border-agri-darkBorder">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Primary Specimen Identifications In Current Estate Cycle
          </span>
          <div className="flex flex-wrap gap-2">
            {activeClass.keyExamples.map((ex) => (
              <span
                key={ex}
                className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-900"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
