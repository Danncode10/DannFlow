import { Database, User, Shield } from "lucide-react";
import { getVibeCheckData, getUserProfile, getGithubRepos } from "@/services/dashboard";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function Home() {
  const profiles = await getVibeCheckData();
  const session = await getUserProfile();
  const user = session?.user;
  const profile = session?.profile;
  const repos = await getGithubRepos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-neutral-800 selection:text-white">
      
      {/* 0. Identity Bar (Top Right) */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20">
        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-4 group hover:border-neutral-700 transition-all duration-500">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-none mb-1">
                   {profile?.role || 'user'}
                 </span>
                 <span className="text-neutral-200 font-medium text-sm">
                   {profile?.full_name || user.email?.split('@')[0]}
                 </span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                profile?.role === 'admin' 
                  ? 'bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'bg-neutral-800 border border-neutral-700 group-hover:bg-neutral-700'
              }`}>
                {profile?.role === 'admin' ? (
                  <Shield className="w-5 h-5 text-blue-400" />
                ) : (
                  <User className="w-5 h-5 text-neutral-400" />
                )}
              </div>
            </div>
          ) : (
            <a href="/login" className="text-neutral-300 hover:text-white transition-colors cursor-pointer group flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                <Database className="w-4 h-4 text-neutral-500 group-hover:text-green-400" />
              </div>
              <span className="text-sm font-medium">Connect Account</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col items-center md:items-start w-full">
        
        {/* 1. Brand Identity */}
        <div className="mb-20 text-center md:text-left w-full">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Vibe System Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-4 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent italic">
            DannFlow
          </h1>
          <p className="text-lg md:text-2xl text-neutral-500 font-light tracking-wide max-w-2xl mx-auto md:mx-0">
            The AI-Native Starter for Architects.
          </p>
        </div>

        {/* 2. Interactive Console Shell */}
        <DashboardShell 
          profiles={profiles} 
          user={user} 
          profile={profile} 
          repos={repos} 
        />

      </main>
    </div>
  );
}

