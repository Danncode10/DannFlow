import { Check, ArrowRight } from "lucide-react";
import { getUserProfile, getVibeCheckData } from "@/services/dashboard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FeaturesTabs } from "@/components/features-tabs";
import { Hero } from "@/components/landing/hero";
import { siteConfig, creatorRepos } from "@/lib/config";


export default async function Home() {
  const session = await getUserProfile();
  const user = session?.user || null;
  const profile = session?.profile;
  const profiles = await getVibeCheckData() || [];
  const repos = creatorRepos;

  return (
    <>
      <Navbar user={user} />

      <Hero isAuthed={!!user} />

      {/* =============================
          FEATURES SECTION (WITH TABS)
          ============================= */}
      <section id="features" className="bg-card border-t border-border isolate">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">

          <div className="text-center mb-16">
            <span className="text-xs font-medium text-primary/70 tracking-wide">
              Features & integrations
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
            <span className="text-xs font-medium text-primary/70 tracking-wide">
              How it works
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-5 tabular-nums">
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
            <span className="text-xs font-medium text-primary/70 tracking-wide">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
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
                href={user ? "/dashboard" : "/login"}
                className="block w-full text-center py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Get Started
              </a>

            </div>

            {/* Pro — highlighted */}
            <div className="rounded-2xl border-2 border-primary bg-background p-8 flex flex-col relative shadow-xl shadow-primary/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Most popular
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
                href={user ? "/dashboard" : "/login"}
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
                    <Check className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
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
      <section className="bg-card border-t border-border relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[900px] rounded-full bg-primary/8 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to build something great?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join builders using {siteConfig.name} to ship websites, apps, and startup MVPs faster.
          </p>
          <a
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-[0_4px_14px_rgba(108,71,255,0.35)] transition-all hover:-translate-y-0.5"
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
