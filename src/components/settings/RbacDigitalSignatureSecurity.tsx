import { useState } from 'react'
import {
  ShieldCheck,
  UserCheck,
  Key,
  FileBadge
} from 'lucide-react'

export interface FarmUserRole {
  name: string
  role: 'Lead Agronomist' | 'Machinery / Drone Operator' | 'Govt Insurance Surveyor'
  email: string
  accessLevel: 'Full Read/Write & Prescriptions' | 'Task Execution & Shift Sheets' | 'Read-Only Audit & Dossiers'
  active: boolean
}

const USERS: FarmUserRole[] = [
  {
    name: 'Dr. Ansh Mishra',
    role: 'Lead Agronomist',
    email: 'ansh.mishra@agro-precision.in',
    accessLevel: 'Full Read/Write & Prescriptions',
    active: true,
  },
  {
    name: 'Sukhdev Singh',
    role: 'Machinery / Drone Operator',
    email: 'sukhdev.operator@agro-precision.in',
    accessLevel: 'Task Execution & Shift Sheets',
    active: true,
  },
  {
    name: 'Er. Rajeshwar Varma',
    role: 'Govt Insurance Surveyor',
    email: 'surveyor.pmfby@punjab.gov.in',
    accessLevel: 'Read-Only Audit & Dossiers',
    active: true,
  },
]

export function RbacDigitalSignatureSecurity() {
  const [users] = useState<FarmUserRole[]>(USERS)
  const [digitalKey] = useState('0x8F9A2B4C6D8E0F1A2B3C4D5E6F7A8B9C')
  const [keyCopied, setKeyCopied] = useState(false)

  const handleCopyKey = () => {
    navigator.clipboard.writeText(digitalKey)
    setKeyCopied(true)
    setTimeout(() => setKeyCopied(false), 2500)
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-agri-darkBorder">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Security &amp; Institutional Governance
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                HMAC-SHA256 Signatures
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Role-Based Access Control (RBAC) &amp; Agronomist Digital Signature
            </h2>
          </div>
        </div>
      </div>

      {/* Users Role Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-forest-700 dark:text-emerald-400" />
            Active Estate Personnel &amp; Permission Tiers
          </span>
          <span className="text-[11px] text-slate-400">3 Verified Authorized Crew Members</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300">
              <tr>
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Institutional Role</th>
                <th className="p-2.5">Access Scope</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-agri-darkBorder">
              {users.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                    {u.name}
                    <p className="text-[10px] font-normal text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{u.role}</td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400 font-medium">{u.accessLevel}</td>
                  <td className="p-2.5">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Digital Signature Stamp Block */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
            <FileBadge className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
            Lead Agronomist Digital Signing Stamp (APEDA / PMFBY Dossiers)
          </span>
          <span className="text-[10px] font-mono text-indigo-600 font-bold">HMAC-SHA256 Validated</span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-300">
          This cryptographic key is embedded in all generated ISO-XML prescriptions, APEDA phytosanitary certificates, and PMFBY loss dossiers to ensure tamper-proof government verification.
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 rounded-xl bg-white dark:bg-agri-darkCard border border-indigo-200 dark:border-indigo-900 px-3 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <Key className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <input
              type="text"
              readOnly
              value={digitalKey}
              className="w-full bg-transparent outline-none font-mono text-slate-800 dark:text-slate-200"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyKey}
            className="rounded-xl bg-indigo-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-800 transition active:scale-95"
          >
            {keyCopied ? 'Copied Key!' : 'Copy Key'}
          </button>
        </div>
      </div>
    </div>
  )
}
