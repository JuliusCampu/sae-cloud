'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  FileCheck2,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Resumen general', icon: LayoutDashboard },
  { label: 'Alumnos', icon: UsersRound },
  { label: 'Calificaciones', icon: BookOpen },
  { label: 'Asistencia', icon: FileCheck2 },
  { label: 'Calendario', icon: CalendarDays },
  { label: 'Finanzas', icon: CircleDollarSign },
]

const activities = [
  { icon: UserRound, title: 'Nueva inscripción validada', detail: 'Mariana López · 2° Secundaria', time: 'Hace 12 min', tone: 'blue' },
  { icon: FileCheck2, title: 'Calificaciones publicadas', detail: 'Periodo 2 · Secundaria', time: 'Hace 38 min', tone: 'green' },
  { icon: CircleDollarSign, title: 'Pago recibido', detail: 'Familia Ramírez · Colegiatura', time: 'Hace 1 h', tone: 'amber' },
]

export function SaeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [active, setActive] = useState('Resumen general')
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-[#12243a] px-4 py-5 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#2a72d4] text-lg font-bold text-white shadow-lg shadow-blue-950/20">S</div>
            <div><p className="text-[15px] font-semibold tracking-tight text-white">SAE<span className="text-blue-400">.cloud</span></p><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Gestión escolar</p></div>
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Cerrar menú" onClick={() => setSidebarOpen(false)}><X className="size-5" /></button>
        </div>
        <div className="mt-10"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p><nav className="mt-3 flex flex-col gap-1">{navItems.map((item) => { const Icon = item.icon; const isActive = active === item.label; return <button key={item.label} onClick={() => { setActive(item.label); setSidebarOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-950/30' : 'text-slate-400 hover:bg-white/7 hover:text-white'}`}><Icon className="size-[17px]" />{item.label}</button> })}</nav></div> 
        <div className="mt-auto rounded-2xl border border-white/8 bg-white/5 p-4"><div className="flex items-center gap-2 text-xs font-medium text-slate-300"><ShieldCheck className="size-4 text-emerald-400" /> Sistema protegido</div><p className="mt-2 text-[11px] leading-relaxed text-slate-500">Tus datos están respaldados y cumplen con las políticas institucionales.</p><button className="mt-3 text-[11px] font-semibold text-blue-400 hover:text-blue-300">Ver estado de seguridad <ArrowUpRight className="ml-1 inline size-3" /></button></div>
      </aside>
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Cerrar navegación" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-5 backdrop-blur-xl sm:px-8"><div className="flex min-w-0 items-center gap-3"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Abrir menú" onClick={() => setSidebarOpen(true)}><Menu className="size-5" /></button><div className="relative hidden w-72 sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-xl border-0 bg-slate-100 pl-9 pr-4 text-sm outline-none ring-blue-200 placeholder:text-slate-400 focus:ring-2" placeholder="Buscar en SAE.cloud" aria-label="Buscar" /></div></div><div className="flex items-center gap-2 sm:gap-4"><button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones"><Bell className="size-[19px]" /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-blue-600" /></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-slate-100"><div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">CV</div><span className="hidden text-left sm:block"><span className="block text-xs font-semibold text-slate-800">Carmen Valenzuela</span><span className="block text-[10px] text-slate-400">Administradora</span></span><ChevronDown className="hidden size-4 text-slate-400 sm:block" /></button></div></header>

        <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Lunes, 9 de noviembre de 2026</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[34px]">Buenos días, Carmen</h1><p className="mt-2 text-sm text-slate-500">Esto es lo que está pasando en tu comunidad escolar.</p></div><button className="flex w-fit items-center gap-2 rounded-xl bg-[#1d5fc1] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-700"><Activity className="size-4" /> Ver actividad completa</button></div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores clave">{[{ label: 'Alumnos activos', value: '1,284', change: '+8.2%', icon: UsersRound, color: 'blue' }, { label: 'Asistencia promedio', value: '94.6%', change: '+2.4%', icon: FileCheck2, color: 'emerald' }, { label: 'Colegiaturas del mes', value: '$842,500', change: '+12.8%', icon: CircleDollarSign, color: 'amber' }, { label: 'Pendientes por revisar', value: '18', change: '3 urgentes', icon: Bell, color: 'rose' }].map((stat) => { const Icon = stat.icon; return <article key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"><div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}><Icon className="size-[18px]" /></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>{stat.change}</span></div><p className="mt-5 text-xs font-medium text-slate-500">{stat.label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p></article> })}</section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]"><article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold text-slate-900">Asistencia general</h2><p className="mt-1 text-xs text-slate-500">Promedio institucional · Últimos 6 meses</p></div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Más opciones de asistencia"><MoreHorizontal className="size-5" /></button></div><div className="mt-8 flex items-end gap-3"><span className="text-4xl font-semibold tracking-[-0.05em] text-slate-900">94.6%</span><span className="mb-1 text-xs font-semibold text-emerald-600">↑ 2.4% vs. periodo anterior</span></div><div className="mt-7 flex h-40 items-end gap-3 sm:gap-5">{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((month, i) => <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={month}><div className={`w-full max-w-10 rounded-t-lg ${i === 5 ? 'bg-blue-600' : 'bg-blue-100'}`} style={{ height: `${[58, 66, 62, 77, 72, 88][i]}%` }} /><span className="text-[10px] font-medium text-slate-400">{month}</span></div>)}</div></article>

          <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold text-slate-900">Próximos eventos</h2><p className="mt-1 text-xs text-slate-500">Agenda institucional</p></div><button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Ver calendario</button></div><div className="mt-5 flex flex-col gap-4">{[{ day: '12', month: 'NOV', title: 'Junta de consejo técnico', time: '08:00 — 10:00' }, { day: '15', month: 'NOV', title: 'Cierre de evaluaciones', time: 'Todo el día' }, { day: '21', month: 'NOV', title: 'Festival de otoño', time: '16:00 — 19:00' }].map((event) => <div key={event.title} className="flex items-center gap-3"><div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-700"><span className="text-base font-bold leading-none">{event.day}</span><span className="mt-0.5 text-[8px] font-bold tracking-wider">{event.month}</span></div><div className="min-w-0"><p className="truncate text-xs font-semibold text-slate-800">{event.title}</p><p className="mt-1 text-[11px] text-slate-400">{event.time}</p></div></div>)}</div></article></section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]"><article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold text-slate-900">Actividad reciente</h2><p className="mt-1 text-xs text-slate-500">Últimos movimientos del sistema</p></div><button className="text-xs font-semibold text-blue-600 hover:text-blue-700">Ver bitácora</button></div><div className="mt-5 divide-y divide-slate-100">{activities.map((activity) => { const Icon = activity.icon; return <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0" key={activity.title}><div className={`flex size-9 items-center justify-center rounded-full ${activity.tone === 'blue' ? 'bg-blue-50 text-blue-600' : activity.tone === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}><Icon className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">{activity.title}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{activity.detail}</p></div><span className="shrink-0 text-[10px] text-slate-400">{activity.time}</span></div> })}</div></article><article className="rounded-2xl bg-[#173457] p-6 text-white shadow-xl shadow-blue-950/10"><div className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Settings2 className="size-[18px] text-blue-300" /></div><h2 className="mt-5 text-lg font-semibold tracking-tight">Completa tu configuración</h2><p className="mt-2 text-xs leading-relaxed text-slate-300">Agrega los datos fiscales del campus para habilitar recibos electrónicos y reportes financieros.</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-blue-400" /></div><div className="mt-2 flex items-center justify-between text-[10px] text-slate-400"><span>68% completado</span><span>3 pasos restantes</span></div><button className="mt-6 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#173457] hover:bg-blue-50">Continuar configuración <ArrowUpRight className="size-3.5" /></button></article></section>
        </main>
      </div>
    </div>
  )
}
