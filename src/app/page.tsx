import { ArrowRight, Check, Star } from "lucide-react";
import { getUserProfile, getVibeCheckData, getGithubRepos } from "@/services/dashboard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeaturesTabs } from "@/components/features-tabs";

export default async function Home() {
  const session = await getUserProfile();
  const user = session?.user;
  const profile = session?.profile;
  const profiles = await getVibeCheckData() || [];
  const repos = await getGithubRepos() || [];

  return (
    <>
      <Navbar user={user} />

      {/* =============================
          HERO SECTION
          ============================= */}
      <section
        id="home"
        className="relative overflow-hidden bg-background"
      >
        {/* Gradient blobs — capped to stay inside hero */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] -z-10" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] -z-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Star className="h-3.5 w-3.5 text-accent" fill="currentColor" />
            <span className="text-xs font-semibold text-primary">
              Built for builders, by builders
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
            Ship Your Next{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
              Big Idea
            </span>{" "}
            in Record Time
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            DannFlow is the AI-native starter template for websites, management
            systems, apps, and startup ideas. Stop building boilerplate — start
            building your vision.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/Danncode10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-secondary transition-all"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              View on GitHub
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-12 text-sm text-muted-foreground">
            Trusted by solo devs and startup teams shipping real products
          </p>
        </div>
      </section>

      {/* =============================
          FEATURES SECTION (WITH TABS)
          ============================= */}
      <section id="features" className="bg-card border-t border-border isolate">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Features & Integrations
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to launch
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              One template. Every essential built in. Check out our active integrations below.
            </p>
          </div>

          <FeaturesTabs
            profiles={profiles}
            repos={repos}
            currentRole={profile?.role}
          />
        </div>
      </section>

      {/* =============================
          HOW IT WORKS SECTION
          ============================= */}
      <section id="how-it-works" className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Three steps to your next project
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                step: "01",
                title: "Clone & Configure",
                description:
                  "Fork the repo, add your Supabase credentials to .env.local, and you are live in under 2 minutes.",
              },
              {
                step: "02",
                title: "Describe Your Vision",
                description:
                  "Use feature prompts in src/prompts/features/ to steer your AI. It reads your schema, types, and services automatically.",
              },
              {
                step: "03",
                title: "Ship & Scale",
                description:
                  "Deploy to Vercel with one click. Your checkpoint system ensures you can always roll back safely.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-400 text-primary-foreground text-xl font-bold mb-5 shadow-lg shadow-primary/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================
          PRICING SECTION
          ============================= */}
      <section id="pricing" className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Start free. Scale when you are ready.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="rounded-2xl border border-border bg-background p-8 flex flex-col">
              <h3 className="text-lg font-semibold text-foreground">Starter</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For solo builders getting started
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Full starter template",
                  "Supabase auth & database",
                  "Checkpoint system",
                  "Community support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="block w-full text-center py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-2xl border-2 border-primary bg-background p-8 flex flex-col relative shadow-xl shadow-primary/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold uppercase">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-foreground">Pro</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For serious builders shipping products
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Starter",
                  "Priority AI support",
                  "Advanced MCP integrations",
                  "Premium templates",
                  "Team collaboration",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
              >
                Start Free Trial
              </a>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-border bg-background p-8 flex flex-col">
              <h3 className="text-lg font-semibold text-foreground">Enterprise</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                For teams and organizations
              </p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-bold text-foreground">Custom</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Pro",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantee",
                  "White-label options",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block w-full text-center py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =============================
          CTA BANNER
          ============================= */}
      <section className="bg-gradient-to-r from-primary to-blue-400 border-t border-primary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to build something great?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Join builders who use DannFlow to ship websites, apps, and startup
            MVPs faster than ever.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 shadow-lg transition-all hover:-translate-y-0.5"
          >
            Start Building
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
