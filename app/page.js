import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Database, 
  Lock, 
  Globe,
  Monitor,
  Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col relative selection:bg-primary selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Image src="/logo.svg" alt="Logo" width={28} height={28} className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Attendance <span className="text-primary">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Intelligence', 'Security'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <LoginLink>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                Sign In
              </Button>
            </LoginLink>
            <LoginLink>
              <Button size="sm" className="hidden sm:flex rounded-xl font-black px-6 shadow-lg shadow-primary/20">
                Launch Console
              </Button>
            </LoginLink>
          </div>
        </div>
      </nav>
      
      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="max-w-5xl w-full px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">v1.0.4 Stable Release</span>
          </div>

          <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Precision Management <br/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-indigo-600">Institutional Power.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            The next generation of student tracking. High-fidelity analytics, 
            automated reporting, and bank-grade security for modern academies.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24 animate-in fade-in duration-1000 delay-500">
            <LoginLink>
              <Button size="lg" className="h-16 px-12 rounded-[24px] text-lg font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all group">
                Access System
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </LoginLink>
            <RegisterLink>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-[24px] text-lg font-black border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all">
                System Registration
              </Button>
            </RegisterLink>
          </div>

          {/* Console Preview Mockup */}
          <div className="relative group mx-auto max-w-5xl animate-in fade-in zoom-in duration-1000 delay-700">
            <div className="absolute inset-0 bg-primary/20 rounded-[40px] blur-[80px] group-hover:bg-primary/30 transition-all duration-1000" />
            <div className="relative bg-slate-900 rounded-[32px] border border-slate-800 p-2 shadow-2xl overflow-hidden aspect-video flex">
              
              {/* Mini Sidebar */}
              <div className="w-16 sm:w-20 border-r border-slate-800 p-4 flex flex-col gap-6 items-center bg-slate-950/50">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-sm bg-primary" />
                </div>
                {[LayoutDashboard, Users, BarChart3, SettingsIcon].map((Icon, i) => (
                  <Icon key={i} className={`h-5 w-5 ${i === 0 ? 'text-primary' : 'text-slate-600'}`} />
                ))}
                <div className="mt-auto w-8 h-8 rounded-full bg-slate-800" />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header Simulation */}
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-24 bg-slate-800 rounded-full mt-1" />
                    <div className="h-6 w-6 rounded-md bg-slate-800" />
                  </div>
                </div>

                {/* Dashboard Grid Simulation */}
                <div className="p-6 flex flex-col gap-6 h-full overflow-hidden">
                  {/* Status Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Presence', val: '94.2%', color: 'bg-emerald-500/10 text-emerald-500' },
                      { label: 'Students', val: '1,280', color: 'bg-primary/10 text-primary' },
                      { label: 'Alerts', val: '3', color: 'bg-rose-500/10 text-rose-500' }
                    ].map((card, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50 flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{card.label}</span>
                        <span className={`text-lg font-black ${card.color.split(' ')[1]}`}>{card.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Visualizations */}
                  <div className="flex-1 grid grid-cols-5 gap-4 pb-6">
                    <div className="col-span-3 bg-slate-800/20 rounded-2xl border border-slate-700/30 p-4 flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                         <div className="h-3 w-32 bg-slate-700 rounded-full" />
                         <div className="h-2 w-12 bg-slate-800 rounded-full" />
                       </div>
                       <div className="flex-1 flex items-end gap-2 px-2">
                          {[40, 70, 45, 90, 65, 80, 30, 50, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                       </div>
                    </div>
                    <div className="col-span-2 space-y-3">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-10 w-full bg-slate-800/40 rounded-xl border border-slate-700/20 flex items-center px-3 gap-3">
                            <div className="h-5 w-5 rounded-full bg-slate-700" />
                            <div className="h-2 flex-1 bg-slate-700/50 rounded-full" />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </section>

        {/* Intelligence Section (Tech Stack) */}
        <section id="intelligence" className="w-full bg-slate-50/50 dark:bg-slate-900/30 py-32 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">The Engine Room</h3>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Built on Industry Standard Intelligence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Next.js 15", desc: "Server-side rendering & optimized routing engine.", icon: Globe, link: "https://nextjs.org" },
                { name: "Kinde Auth", desc: "Enterprise identity management & MFA security.", icon: Lock, link: "https://kinde.com" },
                { name: "Drizzle ORM", desc: "Type-safe database architecture & management.", icon: Database, link: "https://orm.drizzle.team" },
                { name: "Tailwind CSS", desc: "Utility-first design system for fluid UI/UX.", icon: Zap, link: "https://tailwindcss.com" }
              ].map((tech) => (
                <a key={tech.name} href={tech.link} target="_blank" className="group p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                    <tech.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{tech.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{tech.desc}</p>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    View Docs <ArrowRight className="h-3 w-3" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl w-full px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Capabilities</h3>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Everything needed to run an institution.</h2>
              </div>

              <div className="space-y-8">
                {[
                  { title: "Dashboard Overview", icon: LayoutDashboard, desc: "Real-time statistics on presence, absence, and student engagement at a glance." },
                  { title: "Smart Grid System", icon: Monitor, desc: "High-performance data grid for marking attendance with keyboard-first shortcuts." },
                  { title: "Trend Analysis", icon: BarChart3, desc: "Predictive modeling to identify low-attendance students before it becomes an issue." },
                  { title: "Student CRM", icon: Users, desc: "Comprehensive directory for managing profile data, contact info, and academic history." }
                ].map((item) => (
                  <div key={item.title} className="flex gap-6 group">
                    <div className="p-4 bg-primary/5 rounded-2xl h-fit border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-[48px] blur-3xl" />
              <div className="relative space-y-6">
                {/* Mockup 1: Attendance Grid */}
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-xl transition-all hover:scale-[1.02] duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500/40" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                    </div>
                    <div className="h-2 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0" />
                        <div className="h-2 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                        <div className="ml-auto flex gap-1.5">
                          {['bg-emerald-500', 'bg-emerald-500', 'bg-rose-500', 'bg-slate-200'].map((c, j) => (
                            <div key={j} className={`w-5 h-5 rounded-md ${c === 'bg-slate-200' ? 'bg-slate-200 dark:bg-slate-800' : c}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mockup 2: Student Intelligence (Floating) */}
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl transition-all hover:scale-[1.02] duration-500 md:translate-x-12 relative z-20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">JD</div>
                    <div className="space-y-1.5">
                      <div className="h-3 w-32 bg-slate-900 dark:text-white rounded-full font-bold text-[10px] flex items-center">JOHN DOE</div>
                      <div className="h-2 w-48 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest">Attendance</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">98.4%</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                      <span className="text-sm font-black text-emerald-500">EXCELLENT</span>
                    </div>
                  </div>
                </div>

                {/* Mockup 3: Quick Mark Modal */}
                <div className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-xl transition-all hover:scale-[1.02] duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="h-2 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    {['P', 'A', 'L', 'O', 'H'].map((l, i) => (
                      <div key={i} className="flex-1 h-10 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl w-full px-6 py-32 text-center">
          <div className="bg-slate-900 dark:bg-primary/5 rounded-[48px] p-12 md:p-24 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8 relative z-10">
              Ready to modernize your <br/> tracking systems?
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <LoginLink>
                <Button size="lg" className="h-16 px-12 rounded-[24px] text-lg font-black shadow-2xl shadow-primary/20">
                  Deploy Dashboard
                </Button>
              </LoginLink>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-[24px] text-lg font-black text-white border-slate-700 hover:bg-slate-800">
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Image src="/logo.svg" alt="Logo" width={24} height={24} className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Attendance <span className="text-primary">AI</span>
            </h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            &copy; 2026 Institutional Systems &bull; Secure Protocol Terminal
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary cursor-pointer transition-colors">Status</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary cursor-pointer transition-colors">Github</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
