import { Database, GitBranch, Terminal, Sparkles } from "lucide-react";
import { getVibeCheckData, getUserSession, getGithubRepos } from "@/services/dashboard";

export default async function Home() {
  const profiles = await getVibeCheckData();
  const user = await getUserSession();
  const repos = await getGithubRepos();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-neutral-800">
      
      {/* Auth Preview (Top Right) */}
      <div className="absolute top-6 right-6 md:top-12 md:right-12 z-10">
        <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-full px-5 py-2 text-sm font-medium flex items-center shadow-md">
          {user ? (
            <span className="text-neutral-200">Welcome, {user.email || 'Architect'}</span>
          ) : (
            <a href="/login" className="text-neutral-300 hover:text-white transition-colors cursor-pointer group flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 group-hover:bg-green-500 transition-colors"></span>
              Connect Account
            </a>
          )}
        </div>
      </div>
      
      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col items-center md:items-start w-full">
        
        {/* 1. Brand Identity */}
        <div className="mb-20 text-center md:text-left w-full">
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-4 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent transform hover:scale-[1.01] transition-transform duration-500">
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
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite] mt-0.5"></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Supabase</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">Database Brain Linked</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4 hover:border-neutral-700 transition duration-300 group">
            <div className="p-3 bg-neutral-950 rounded-xl group-hover:bg-neutral-800 transition-colors">
              <GitBranch className="w-6 h-6 text-neutral-400 group-hover:text-green-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite] mt-0.5" style={{ animationDelay: '0.2s' }}></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">GitHub</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">Version Control Memory Active</p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-xl flex items-start space-x-4 hover:border-neutral-700 transition duration-300 group">
            <div className="p-3 bg-neutral-950 rounded-xl group-hover:bg-neutral-800 transition-colors">
              <Terminal className="w-6 h-6 text-neutral-400 group-hover:text-green-400 transition-colors" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-[pulse_2s_ease-in-out_infinite] mt-0.5" style={{ animationDelay: '0.4s' }}></span>
                <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Terminal</span>
              </div>
              <p className="text-sm font-medium text-neutral-200 font-mono">Local Execution Hands Ready</p>
            </div>
          </div>

        </div>

        {/* 3. Vibe Check Section (Live Data) */}
        <div className="w-full mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-200">Check if Supabase MCP is connected</h2>
              <div className="flex items-center gap-2 mt-2 text-neutral-500">
                <Sparkles className="w-4 h-4 text-green-500/50" />
                <p className="text-sm italic">Used by AI to auto-generate schemas, debug RLS, and orchestrate live database states.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 self-start md:self-center">
              public.profiles
            </span>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative group">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/10 transition-colors duration-700"></div>

            {profiles && profiles.length > 0 ? (
              <ul className="space-y-4 relative z-10 w-full">
                {profiles.map((profile: any, i: number) => (
                  <li key={i} className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all">
                    <span className="font-mono text-sm text-neutral-300 truncate">{JSON.stringify(profile)}</span>
                    <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded-md ml-4 shrink-0">Fetched</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 relative z-10">
                <div className="w-16 h-16 border border-neutral-800 rounded-2xl bg-neutral-900/50 flex items-center justify-center mb-6">
                  <Database className="w-8 h-8 text-neutral-600" />
                </div>
                <p className="text-neutral-400 font-mono text-base text-center max-w-md">
                  {user ? "No Data Found - Connection Active" : "is this empty? add an account to test if your supabase works"}
                </p>
                {!user && (
                    <a href="/login" className="mt-6 text-sm font-mono text-neutral-500 hover:text-neutral-200 underline decoration-neutral-800 underline-offset-4 decoration-2 transition-all">
                        Connect account to fetch live profiles
                    </a>
                )}
                <div className="mt-6 flex space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* 4. GitHub Vibe Check Section */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-200">Check if GitHub MCP is connected</h2>
              <div className="flex items-center gap-2 mt-2 text-neutral-500">
                <GitBranch className="w-4 h-4 text-blue-500/50" />
                <p className="text-sm italic">Used by AI to read history, analyze commit patterns, and provide contextual repository insights.</p>
              </div>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800 self-start md:self-center">
              API.repositories
            </span>
          </div>

          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative group">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 w-full">
              {repos.map((repo: any, i: number) => (
                <a 
                  key={i} 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50 hover:bg-neutral-800/50 hover:border-blue-900/50 transition-all group/repo"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-neutral-200">{repo.name}</span>
                    <GitBranch className="w-4 h-4 text-neutral-600 group-hover/repo:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{repo.description || "No description provided."}</p>
                </a>
              ))}
            </ul>
             
          </div>

          <div className="mt-12 p-6 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl">
            <h3 className="text-sm font-mono font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              The MCP Vibe Advantage
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-3xl">
              In <span className="text-neutral-300 font-medium">DannFlow</span>, MCP (Model Context Protocol) servers aren't just tools—they are the eyes and hands of your AI partner. By granting the AI direct access to your <span className="text-green-500/80">Supabase</span> schema and <span className="text-blue-500/80">GitHub</span> memory, you enable "Vibe Coding": a state where you describe the outcome, and the AI handles the orchestration, debugging, and data synchronization with 100% architectural precision.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
