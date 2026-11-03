import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { CalendarTask } from '../types'

export function CalendarPage() {
  const { calendarTasks, addTask, deleteTask, toggleTaskCompleted, t } = useAppStore()

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)

  // New task form state
  const [title, setTitle] = useState('')
  const [crop, setCrop] = useState('Wheat')
  const [category, setCategory] = useState<CalendarTask['category']>('inspection')
  const [date, setDate] = useState('2026-11-06')
  const [time, setTime] = useState('08:30 AM')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
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
      notes,
    })
    setTitle('')
    setNotes('')
    setModalOpen(false)
  }

  const filteredTasks = calendarTasks.filter((task) =>
    activeCategory === 'all' ? true : task.category === activeCategory
  )

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
      {/* Header */}
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
            {t('calendar.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            {t('calendar.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-forest-800 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-forest-900/20 transition hover:bg-forest-900 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <Plus className="h-4 w-4" /> {t('calendar.addTask')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
            className={`rounded-2xl px-4 py-2 text-xs font-bold transition flex-shrink-0 ${
              activeCategory === tab.id
                ? 'bg-forest-800 text-white shadow-sm dark:bg-emerald-600'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-agri-darkBorder dark:bg-agri-darkCard dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-agri-darkBorder dark:bg-agri-darkSurface">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {t('calendar.noTasks')}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Click &quot;{t('calendar.addTask')}&quot; to create a new task.
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
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      categoryColors[taskItem.category]
                    }`}
                  >
                    {t(`calendar.${taskItem.category}`) || taskItem.category}
                  </span>
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
                <p className="mt-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  Target: {taskItem.crop}
                </p>

                {taskItem.notes && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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

      {/* Add Task Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-agri-darkBorder dark:bg-agri-darkSurface"
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

