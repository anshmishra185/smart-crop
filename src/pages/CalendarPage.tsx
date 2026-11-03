import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { AudioAdvisoryButton } from '../components/common/AudioAdvisoryButton'
import { getCalendarOperationsAudio } from '../lib/advisorySpeech'
import { BbchPhenologyTimeline } from '../components/calendar/BbchPhenologyTimeline'
import { WeatherGatedSprayAdvisor } from '../components/calendar/WeatherGatedSprayAdvisor'
import { PhiReiSafetyTracker } from '../components/calendar/PhiReiSafetyTracker'
import { MachineFleetCrewEngine } from '../components/calendar/MachineFleetCrewEngine'
import { IcarTemplateLoader } from '../components/calendar/IcarTemplateLoader'
import { OperationsShiftSheetModal } from '../components/calendar/OperationsShiftSheetModal'
import type { CalendarTask } from '../types'

export function CalendarPage() {
  const {
    calendarTasks,
    addTask,
    deleteTask,
    toggleTaskCompleted,
    weather,
    selectedRegion,
    t,
  } = useAppStore()

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedBbchCode, setSelectedBbchCode] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06')
  const [modalOpen, setModalOpen] = useState(false)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)

  // New task form state
  const [title, setTitle] = useState('')
  const [crop, setCrop] = useState('Wheat')
  const [category, setCategory] = useState<CalendarTask['category']>('inspection')
  const [date, setDate] = useState('2026-11-06')
  const [time, setTime] = useState('08:30 AM')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [bbchStage, setBbchStage] = useState('BBCH 10–19')
  const [assignedMachine, setAssignedMachine] = useState('Mahindra 575 DI + 500L Boom Sprayer')
  const [assignedCrew, setAssignedCrew] = useState('Harpreet Singh')
  const [notes, setNotes] = useState('')

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    addTask({
      title,
      crop,
      category,
      date,
      time,
      priority,
      completed: false,
      bbchStage,
      assignedMachine,
      assignedCrew,
      notes,
    })
    setTitle('')
    setNotes('')
    setModalOpen(false)
  }

  // Load bulk tasks from ICAR templates
  const handleLoadTemplateTasks = (templateTasks: Omit<CalendarTask, 'id' | 'completed'>[]) => {
    templateTasks.forEach((t) => {
      addTask({
        ...t,
        completed: false,
      })
    })
  }

  // Task count by date map for calendar grid
  const taskCountByDate = calendarTasks.reduce<Record<string, number>>((acc, task) => {
    acc[task.date] = (acc[task.date] || 0) + 1
    return acc
  }, {})

  // Filter tasks by category & BBCH
  const filteredTasks = calendarTasks.filter((task) => {
    const matchesCategory = activeCategory === 'all' || task.category === activeCategory
    const matchesBbch = !selectedBbchCode || task.bbchStage === selectedBbchCode
    return matchesCategory && matchesBbch
  })

  const urgentTasksCount = calendarTasks.filter((t) => t.priority === 'high' && !t.completed).length

  const categoryColors: Record<CalendarTask['category'], string> = {
    sowing: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    irrigation: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    fertilizer: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    inspection: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    harvest: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
    weather: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card dark:border-agri-darkBorder dark:bg-agri-darkSurface sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <CalendarIcon className="h-4 w-4" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('calendar.badge')}
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {t('calendar.title')} — {selectedRegion}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Precision Farm Operations Planning, BBCH Phenological Milestones & Weather-Gated Work Dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <AudioAdvisoryButton
            label="Listen Briefing"
            variant="solid"
            getNarrative={(l) =>
              getCalendarOperationsAudio(
                {
                  location: selectedRegion,
                  totalTasks: calendarTasks.length,
                  urgentTasksCount,
                  isSprayingFavourable: weather.favourableSpraying,
                },
                l
              )
            }
          />

          <button
            type="button"
            onClick={() => setIsShiftModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-forest-800 px-4 py-2 text-xs font-black text-white hover:bg-forest-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-sm transition active:scale-95"
          >
            <FileText className="h-4 w-4 text-emerald-300" />
            Export Shift Sheet
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl bg-lime-400 px-4 py-2 text-xs font-extrabold text-slate-900 shadow-lg shadow-lime-400/20 transition hover:bg-lime-300 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Schedule Task
          </button>
        </div>
      </div>

      {/* Module 1: 30-Day Grid & BBCH Phenological Growth Stage Timeline */}
      <BbchPhenologyTimeline
        selectedBbchCode={selectedBbchCode}
        onSelectBbch={setSelectedBbchCode}
        taskCountByDate={taskCountByDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Module 2: Weather-Gated Smart Spraying & Irrigation Window Advisor */}
      <WeatherGatedSprayAdvisor
        temperature={weather.temp}
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        rainfallProb={weather.rainfallProb}
        favourableSpraying={weather.favourableSpraying}
      />

      {/* Module 3 & 4: Agrochemical Safety Tracker (PHI/REI) & Machine Fleet Dispatch */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PhiReiSafetyTracker />
        <MachineFleetCrewEngine />
      </div>

      {/* Module 5: ICAR Package of Practices 1-Click Protocol Loader */}
      <IcarTemplateLoader onLoadTasks={handleLoadTemplateTasks} />

      {/* Scheduled Operations Work Order List */}
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-2 dark:border-agri-darkBorder">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Scheduled Field Operations
            </h2>
            <p className="text-xs text-slate-500">
              {filteredTasks.length} Operations match active category &amp; phenological filter
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: t('calendar.allTasks') },
              { id: 'sowing', label: t('calendar.sowing') },
              { id: 'irrigation', label: t('calendar.irrigation') },
              { id: 'fertilizer', label: t('calendar.fertilizer') },
              { id: 'inspection', label: t('calendar.inspection') },
              { id: 'harvest', label: t('calendar.harvest') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition flex-shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-forest-800 text-white shadow-xs dark:bg-emerald-600'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-agri-darkBorder dark:bg-agri-darkSurface">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {t('calendar.noTasks')}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Click &quot;Schedule Task&quot; or load a pre-built ICAR Package of Practices template above.
              </p>
            </div>
          ) : (
            filteredTasks.map((taskItem) => (
              <div
                key={taskItem.id}
                className={`flex flex-col justify-between rounded-3xl border p-5 shadow-card transition duration-200 ${
                  taskItem.completed
                    ? 'border-slate-200 bg-slate-50/70 opacity-60 dark:border-agri-darkBorder dark:bg-agri-darkCard/50'
                    : 'border-slate-200/90 bg-white hover:-translate-y-1 hover:border-emerald-300 dark:border-agri-darkBorder dark:bg-agri-darkSurface'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          categoryColors[taskItem.category]
                        }`}
                      >
                        {t(`calendar.${taskItem.category}`) || taskItem.category}
                      </span>
                      {taskItem.priority === 'high' && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black uppercase text-red-700 dark:bg-red-950 dark:text-red-300">
                          Urgent
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTask(taskItem.id)}
                      className="text-slate-300 hover:text-red-500 transition"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3
                    className={`mt-3 text-base font-extrabold ${
                      taskItem.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {taskItem.title}
                  </h3>

                  <div className="mt-1 flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-800 dark:text-emerald-400">
                      Crop: {taskItem.crop}
                    </span>
                    {taskItem.bbchStage && (
                      <span className="font-mono text-[10px] text-slate-400">
                        {taskItem.bbchStage}
                      </span>
                    )}
                  </div>

                  {taskItem.assignedMachine && (
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Machine:</strong> {taskItem.assignedMachine}
                    </p>
                  )}

                  {taskItem.notes && (
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {taskItem.notes}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-agri-darkBorder">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{taskItem.date}</span>
                    {taskItem.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {taskItem.time}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTaskCompleted(taskItem.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                      taskItem.completed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-agri-darkBorder dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {taskItem.completed ? t('calendar.completed') : t('calendar.markDone')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Module 6: Printable Shift Dispatch Modal */}
      <OperationsShiftSheetModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        tasks={calendarTasks}
        location={selectedRegion}
        selectedDate={selectedDate}
      />

      {/* Add Task Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-agri-darkBorder">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Schedule Farming Task
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-agri-darkCard"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Task Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Foliar Spraying Mancozeb 75% WP"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Crop:
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Rice">Rice</option>
                    <option value="Tomato">Tomato</option>
                    <option value="Potato">Potato</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Operation Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  >
                    <option value="inspection">Pathology Scouting</option>
                    <option value="sowing">Sowing Schedule</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="fertilizer">Fertilizer Application</option>
                    <option value="harvest">Harvesting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    BBCH Phenological Stage:
                  </label>
                  <select
                    value={bbchStage}
                    onChange={(e) => setBbchStage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  >
                    <option value="BBCH 00–09">BBCH 00–09 (Germination / Sowing)</option>
                    <option value="BBCH 10–19">BBCH 10–19 (Leaf Development & CRI)</option>
                    <option value="BBCH 20–29">BBCH 20–29 (Active Tillering)</option>
                    <option value="BBCH 30–39">BBCH 30–39 (Stem Elongation / Jointing)</option>
                    <option value="BBCH 50–59">BBCH 50–59 (Booting / Heading)</option>
                    <option value="BBCH 70–89">BBCH 70–89 (Grain Filling)</option>
                    <option value="BBCH 90–99">BBCH 90–99 (Ripening & Harvest)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Assigned Machine Fleet:
                  </label>
                  <select
                    value={assignedMachine}
                    onChange={(e) => setAssignedMachine(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  >
                    <option value="Mahindra 575 DI + 500L Boom Sprayer">Tractor 500L Boom Sprayer</option>
                    <option value="PAU Super Seeder">PAU Super Seeder (No-Till)</option>
                    <option value="Laser Land Leveler">Laser Land Leveler</option>
                    <option value="Solar Drip Solenoid Valve #3">Solar Drip Solenoid Valve #3</option>
                    <option value="Claas Combine Harvester">Combine Harvester</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Time:</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Crew Lead / Field Operator:
                </label>
                <input
                  type="text"
                  value={assignedCrew}
                  onChange={(e) => setAssignedCrew(e.target.value)}
                  placeholder="e.g., Harpreet Singh"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Agronomic Notes / Dosages:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g., Mix 2.5 g/L Mancozeb with 1.5 mL wetting agent."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-forest-800 px-5 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-forest-900 dark:bg-emerald-600"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
