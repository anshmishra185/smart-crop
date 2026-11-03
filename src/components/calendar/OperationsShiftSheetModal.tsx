import {
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { CalendarTask } from '../../types'

interface ShiftSheetModalProps {
  isOpen: boolean
  onClose: () => void
  tasks: CalendarTask[]
  location: string
  selectedDate: string
}

export function OperationsShiftSheetModal({
  isOpen,
  onClose,
  tasks,
  location,
  selectedDate,
}: ShiftSheetModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const shiftCode = `DISP-${selectedDate.replace(/-/g, '')}-882`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface print:border-none print:shadow-none print:max-w-none print:p-4 text-slate-800 dark:text-slate-100">
        {/* Controls - Hidden during print */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-agri-darkBorder print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-forest-100 text-forest-800 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Daily Farm Operations Work Shift Sheet & Dispatch Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official Machinery & Field Crew Work Orders for Field Hands & Tractor Drivers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" /> Print Shift Sheet
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-agri-darkCard dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="space-y-6 pt-4 print:pt-0">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-forest-800 pb-4 dark:border-emerald-500">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-forest-800 dark:text-emerald-400" />
                <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Krishi Saarthi Precision Agriculture Estate
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Field Operations Management • Farm Sector Dispatch Log
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Shift ID: {shiftCode} • Scheduled Date: {selectedDate} • Region: {location}
              </p>
            </div>

            <div className="mt-3 sm:mt-0 flex items-center gap-3">
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Verification QR</span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">DISPATCH-AUTH</span>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard">
                <QrCode className="h-10 w-10 text-slate-800 dark:text-slate-200" />
              </div>
            </div>
          </div>

          {/* Shift Summary Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-agri-darkCard border border-slate-200/80 dark:border-agri-darkBorder">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Work Orders</span>
              <p className="font-black text-slate-900 dark:text-white">{tasks.length} Operations</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Priority Level</span>
              <p className="font-black text-red-600">Urgent Field Interventions</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Machinery Deployed</span>
              <p className="font-black text-slate-900 dark:text-white">3 Tractors / 1 Solenoid</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Agro-Chemical Safety</span>
              <p className="font-black text-amber-600">REI Monitored (PPE Mandatory)</p>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-agri-darkBorder">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 dark:bg-agri-darkCard dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Operation / Task Title</th>
                  <th className="p-3">Target Crop & Stage</th>
                  <th className="p-3">Assigned Machine & Crew</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-agri-darkBorder text-slate-800 dark:text-slate-200 font-medium">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-agri-darkCard/40">
                    <td className="p-3 font-mono font-bold text-slate-500 whitespace-nowrap">
                      {task.time || '08:00 AM'}
                    </td>
                    <td className="p-3">
                      <span className="font-black block text-slate-900 dark:text-white">{task.title}</span>
                      {task.notes && (
                        <span className="text-[11px] text-slate-500 line-clamp-1">{task.notes}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="font-bold">{task.crop}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {task.bbchStage || 'Vegetative'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold">{task.assignedMachine || 'General Equipment'}</span>
                      <span className="text-[10px] text-slate-500 block">
                        Lead: {task.assignedCrew || 'Farm Hand'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${task.completed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                      >
                        {task.completed ? 'Done' : 'Dispatched'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety Checklist */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs dark:border-amber-900/50 dark:bg-amber-950/20 space-y-1.5">
            <span className="font-black uppercase text-amber-900 dark:text-amber-300 text-[10px] block">
              Pre-Dispatch Chemical & Machine Safety Checklist
            </span>
            <p className="text-amber-950 dark:text-amber-200">
              ✓ Tractor PTO shields and spray nozzle calibration checked @ 2.2 bar pressure.
            </p>
            <p className="text-amber-950 dark:text-amber-200">
              ✓ Full PPE (nitrile gloves, chemical face mask, goggles) issued to foliar application crew.
            </p>
            <p className="text-amber-950 dark:text-amber-200">
              ✓ Re-entry caution boards installed on perimeter borders for 24-hour REI hazard window.
            </p>
          </div>

          {/* Signatures */}
          <div className="border-t border-slate-200 pt-4 dark:border-agri-darkBorder text-[10px] text-slate-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p>Certified by Krishi Saarthi Precision Farm Command Engine.</p>
              <p>Shift log archived for agronomic traceability and CIB&RC audits.</p>
            </div>
            <div className="flex gap-8 text-right">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Harpreet Singh</p>
                <p>Fleet Lead Operator</p>
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Dr. M. S. Bajwa</p>
                <p>Estate Agronomist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
