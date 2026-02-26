'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error)
  }, [error])
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-slate-950">
      <div className="relative mb-10 group">
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all duration-1000 animate-pulse" />
        <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-rose-100 dark:border-rose-900/30 shadow-2xl transition-transform duration-500 hover:scale-105">
          <AlertCircle className="h-16 w-16 text-rose-500" />
        </div>
      </div>

      <div className="space-y-4 max-w-xl">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Interruption</h2>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed">
          The intelligence engine encountered an unexpected exception while processing this view.
        </p>
        <p className="text-sm text-slate-400 font-medium">
          Error signature: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-rose-500 font-mono">{error.digest || 'Internal Error'}</code>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12">
        <Button
          onClick={() => reset()}
          className="h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 group"
        >
          <RefreshCcw className="h-5 w-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
          Relaunch View
        </Button>
        <Button
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
          className="h-14 px-10 rounded-2xl font-black border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 transition-all"
        >
          Return to Dashboard
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-16 w-full max-w-2xl text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Developer Trace (Debug Only)</p>
          <div className="p-6 bg-slate-900 rounded-[24px] border border-slate-800 shadow-2xl overflow-auto max-h-60 custom-scrollbar">
            <pre className="text-[11px] font-mono text-emerald-400/80 leading-relaxed">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-12">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Attendance AI Systems &bull; Recovery Console</p>
      </div>
    </div>
  )
}
