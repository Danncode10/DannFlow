import { Database, GitBranch, Terminal, Sparkles, User, Shield, Edit3, Settings } from "lucide-react";
import { getVibeCheckData, getUserProfile, getGithubRepos } from "@/services/dashboard";

export default async function Home() {
  const profiles = await getVibeCheckData();
  const session = await getUserProfile();
  const user = session?.user;
  const profile = session?.profile;
  const repos = await getGithubRepos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-neutral-800">
      
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
                  ? 'bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20' 
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
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-4 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
            DannFlow
          </h1>
          <p className="text-lg md:text-2xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto md:mx-0">
            The AI-Native Starter for High-Achieving Architects.
          </p>
        </div>

        {/* 2. The Trinity Status Board */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4 hover:border-neutral-700 transition duration-300 group">
            <div className="p-3 bg-neutral-950 rounded-xl group-hover:bg-neutral-800 transition-colors">
              <Database className="w-6 h-6 text-neutral-400 group-hover:text-green-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mt-0.5"></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Supabase</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">Live Sync: Active</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4 hover:border-neutral-700 transition duration-300 group">
            <div className="p-3 bg-neutral-950 rounded-xl group-hover:bg-neutral-800 transition-colors">
              <GitBranch className="w-6 h-6 text-neutral-400 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mt-0.5"></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">GitHub</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">Repo Context: Loaded</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4 hover:border-neutral-700 transition duration-300 group">
            <div className="p-3 bg-neutral-950 rounded-xl group-hover:bg-neutral-800 transition-colors">
              <Terminal className="w-6 h-6 text-neutral-400 group-hover:text-orange-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse mt-0.5"></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Terminal</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">MCP Execution: Ready</p>
            </div>
          </div>
        </div>

        {/* 3. Supabase Vibe Check Section */}
        <div className="w-full mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-200">Database Orchestration</h2>
              <div className="flex items-center gap-2 mt-2 text-neutral-500">
                <Sparkles className="w-4 h-4 text-green-500/50" />
                <p className="text-sm italic">AI is currently watching <span className="text-neutral-300">public.profiles</span> for vibe deviations.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.role === 'admin' && (
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Admin Privileges Enabled
                </span>
              )}
              <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                v1.0.4-live
              </span>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-green-500/10 transition-all duration-1000"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full">
              {profiles && profiles.length > 0 ? (
                profiles.map((p: any, i: number) => (
                  <div key={i} className="p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all group/card relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center group-hover/card:bg-neutral-700 transition-colors">
                        <User className="w-6 h-6 text-neutral-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-neutral-200 font-medium truncate">{p.email || 'Anonymous'}</p>
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{p.role || 'user'}</p>
                      </div>
                      {profile?.role === 'admin' && (
                        <button className="p-2 rounded-lg bg-neutral-800 text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all opacity-0 group-hover/card:opacity-100">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className={`h-full ${p.role === 'admin' ? 'bg-blue-500' : 'bg-green-500'} w-2/3`}></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-neutral-600 uppercase tracking-tighter">
                        <span>Connection Stability</span>
                        <span>98.2%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-8 relative group">
                    <div className="absolute inset-0 bg-green-500/10 rounded-3xl blur-xl animate-pulse group-hover:bg-green-500/20 transition-all"></div>
                    <Database className="w-10 h-10 text-neutral-700 relative z-10" />
                  </div>
                  <h3 className="text-xl font-medium text-neutral-200 mb-2">Supabase connection is empty</h3>
                  <p className="text-neutral-500 font-mono text-sm max-w-sm mb-8">
                    is this empty? add an account to test if your supabase works
                  </p>
                  {!user && (
                    <a href="/login" className="px-8 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-all shadow-xl">
                      Witness the Architecture →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. GitHub Vibe Check Section */}
        <div className="w-full">
           {/* Section Header */}
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-200">Version Control Context</h2>
              <div className="flex items-center gap-2 mt-2 text-neutral-500">
                <GitBranch className="w-4 h-4 text-blue-500/50" />
                <p className="text-sm italic">AI is currently indexing <span className="text-neutral-300">GitHub API.repositories</span> for project history.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group mb-12">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 w-full">
              {repos.map((repo: any, i: number) => (
                <a 
                  key={i} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col p-5 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 hover:bg-neutral-900/60 hover:border-blue-900/30 transition-all group/repo"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold text-neutral-200 group-hover/repo:text-blue-400 transition-colors uppercase tracking-tight">{repo.name}</span>
                    <GitBranch className="w-4 h-4 text-neutral-700 group-hover/repo:text-blue-500/50 transition-colors" />
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 italic">"{repo.description || "No mission statement provided for this repository."}"</p>
                </a>
              ))}
            </div>
          </div>

          {/* Vibe Advatnage Card */}
          <div className="p-8 bg-neutral-900/20 border border-neutral-800/50 rounded-3xl backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-neutral-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-neutral-500/10 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-inner border border-neutral-800/50">
                <Sparkles className="w-8 h-8 text-neutral-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                  The MCP Vibe Advantage
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-4xl italic">
                  "In <span className="text-neutral-300 font-medium">DannFlow</span>, MCP servers aren't just tools—they are the eyes and hands of your AI partner. By granting direct access to your <span className="text-green-500/80">Supabase</span> and <span className="text-blue-500/80">GitHub</span> memory, you enable <span className="text-white">Vibe Coding</span>: a transcendental state where you describe the outcome, and the AI handles the architecture with zero friction."
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
