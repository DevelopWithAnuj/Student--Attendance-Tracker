import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      
      <main className="relative z-10 max-w-5xl w-full px-6 py-20 flex flex-col items-center text-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="bg-primary/10 p-3 rounded-2xl shadow-xl shadow-primary/5">
            <Image src="/logo.svg" alt="Attendance AI Logo" width={48} height={48} className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            Attendance <span className="text-primary font-black">AI</span>
          </h1>
        </div>

        {/* Hero Content */}
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Institutional Intelligence <br/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Redefined.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            The next generation of student management. Precision tracking, 
            automated analytics, and institutional-grade security.
          </p>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mb-16 animate-in fade-in duration-1000 delay-500">
          {[
            { icon: ShieldCheck, text: "Enterprise Security", color: "text-emerald-500" },
            { icon: Zap, text: "Real-time Analytics", color: "text-amber-500" },
            { icon: CheckCircle2, text: "Automated Reporting", color: "text-blue-500" }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center justify-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
              <feature.icon className={`h-5 w-5 ${feature.color}`} />
              <span className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in duration-1000 delay-700">
          <LoginLink>
            <Button size="lg" className="h-16 px-12 rounded-[20px] text-lg font-black shadow-2xl shadow-primary/20 hover:scale-105 transition-all group">
              Launch Console
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </LoginLink>
          
          <RegisterLink>
            <Button size="lg" variant="outline" className="h-16 px-12 rounded-[20px] text-lg font-black border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all">
              Request Access
            </Button>
          </RegisterLink>
        </div>
      </main>

      <footer className="absolute bottom-10 w-full text-center text-slate-400 animate-in fade-in duration-1000 delay-1000">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">
          Attendance AI Systems &bull; Secure Institutional Terminal
        </p>
      </footer>
    </div>
  );
}
