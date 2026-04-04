import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const features = [
  {
    icon: "quiz",
    title: "Practice Exams",
    description:
      "ICDC-difficulty multiple choice exams for all 59 DECA events. Immediate feedback with AI-powered explanations for every answer.",
    accent: "#ADC6FF",
  },
  {
    icon: "record_voice_over",
    title: "Role Play Coach",
    description:
      "Tackle realistic judged scenarios. Our AI evaluates your response against official DECA rubrics and shows you exactly where to improve.",
    accent: "#FFB95F",
  },
  {
    icon: "track_changes",
    title: "PI Mastery Tracker",
    description:
      "500+ Performance Indicators mapped to every event cluster. Track Untested → Learning → Mastered as you practice.",
    accent: "#4EDEA5",
  },
];

const steps = [
  {
    number: "01",
    title: "Sign Up Free",
    description: "Create an account in seconds — no credit card, no paywall. Ever.",
  },
  {
    number: "02",
    title: "Choose Your Event",
    description: "Select any of the 59 DECA competitive events and build a focused study plan.",
  },
  {
    number: "03",
    title: "Start Practicing",
    description: "Tackle exams, role plays, and PI drills. Watch your mastery scores climb.",
  },
];

const clusters = [
  { name: "Finance", icon: "account_balance", color: "#ADC6FF" },
  { name: "Marketing", icon: "campaign", color: "#FFB95F" },
  { name: "Business Mgmt", icon: "business_center", color: "#4EDEA5" },
  { name: "Hospitality", icon: "hotel", color: "#FFB4AB" },
  { name: "Entrepreneurship", icon: "rocket_launch", color: "#C3AAFF" },
  { name: "Personal Finance", icon: "savings", color: "#80DEEA" },
];

const testimonials = [
  {
    quote:
      "I went from not knowing what a PI was to placing at States in three months. Podium's role play feedback is insane.",
    name: "Alex R.",
    event: "Principles of Finance",
  },
  {
    quote:
      "The practice exams are actually hard — harder than the ones at conference. That's exactly what you need to prepare.",
    name: "Priya M.",
    event: "Business Management & Administration",
  },
  {
    quote:
      "Having all 59 events in one place with AI explanations changed how our entire chapter studies. Wish this existed sooner.",
    name: "Jordan T.",
    event: "Marketing Communications Series",
  },
];

const stats = [
  { value: "59", label: "Events Covered" },
  { value: "500+", label: "Performance Indicators" },
  { value: "AI", label: "Powered Coaching" },
  { value: "100%", label: "Free Forever" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 frosted-glass">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="material-symbols-outlined text-2xl gradient-text"
              style={{ fontVariationSettings: '"FILL" 1, "wght" 600' }}
            >
              emoji_events
            </span>
            <span className="font-headline font-bold text-xl tracking-tight text-on-surface">
              Podium
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-outline hover:text-on-surface transition-colors"
            >
              Features
            </a>
            <a
              href="#events"
              className="text-sm text-outline hover:text-on-surface transition-colors"
            >
              Events
            </a>
            <a
              href="#about"
              className="text-sm text-outline hover:text-on-surface transition-colors"
            >
              About
            </a>
          </div>

          {/* CTA */}
          <Link
            href="/signup"
            className="gradient-cta px-5 py-2 rounded-lg text-sm font-semibold font-body transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="pt-40 pb-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-1.5 mb-8">
              <span
                className="material-symbols-outlined text-base"
                style={{
                  color: "#4EDEA5",
                  fontVariationSettings: '"FILL" 1',
                }}
              >
                verified
              </span>
              <span className="text-xs font-medium text-on-surface-variant">
                Free · No paywall · ICDC-level difficulty
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
              The Free DECA Prep
              <br />
              Platform That{" "}
              <span className="gradient-text">Actually Works.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-outline max-w-2xl mb-10 leading-relaxed font-body">
              AI-powered role play coaching, PI mastery tracking, vocab flashcards, and
              practice exams for all 59 DECA events — built by competitors, for
              competitors.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/signup"
                className="gradient-cta px-8 py-3.5 rounded-lg font-semibold font-body text-base transition-opacity hover:opacity-90"
              >
                Get Started Free
              </Link>
              <Link
                href="/events"
                className="px-8 py-3.5 rounded-lg font-semibold font-body text-base bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
              >
                See All Events
              </Link>
            </div>
          </div>

          {/* Floating trophy accent */}
          <div className="mt-16 flex items-center gap-6 text-outline">
            <span
              className="material-symbols-outlined text-7xl md:text-9xl"
              style={{
                color: "#ADC6FF",
                opacity: 0.15,
                fontVariationSettings: '"FILL" 1, "wght" 700',
              }}
            >
              emoji_events
            </span>
            <div className="space-y-1">
              <p className="text-sm text-outline">Trusted by DECA competitors nationwide</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className="material-symbols-outlined text-base"
                    style={{ color: "#FFB95F", fontVariationSettings: '"FILL" 1' }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-12 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-headline text-4xl md:text-5xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-outline font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-outline mb-3 font-body">
              What you get
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
              Everything you need to place.
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-surface-container-low rounded-2xl p-8 hover:bg-surface-container transition-colors overflow-hidden"
              >
                {/* Left accent bar on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: feature.accent }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${feature.accent}18` }}
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{
                      color: feature.accent,
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {feature.icon}
                  </span>
                </div>

                <h3 className="font-headline text-xl font-bold mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-outline text-sm leading-relaxed font-body">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-outline mb-3 font-body">
              Simple by design
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
              Three steps to the podium.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector line (not last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-surface-container-high -translate-x-4 z-0" />
                )}

                <div className="relative z-10">
                  <div className="font-headline text-6xl font-extrabold gradient-text opacity-30 mb-4 leading-none">
                    {step.number}
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-outline text-sm leading-relaxed font-body">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUSTER GRID ── */}
      <section id="events" className="py-24 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-outline mb-3 font-body">
              All clusters
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
              59 events. Every cluster.
            </h2>
            <p className="text-outline mt-4 font-body max-w-xl">
              From Principles of Finance to Fashion Marketing, we have practice material
              for every DECA competitive event.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <Link
                key={cluster.name}
                href="/events"
                className="group flex items-center gap-4 bg-surface-container-low rounded-2xl p-6 hover:bg-surface-container transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${cluster.color}18` }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{
                      color: cluster.color,
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {cluster.icon}
                  </span>
                </div>
                <span className="font-headline font-semibold text-sm tracking-tight group-hover:text-on-surface text-on-surface-variant transition-colors">
                  {cluster.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-outline hover:text-on-surface transition-colors font-body"
            >
              View all 59 events
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section id="about" className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-outline mb-3 font-body">
              From competitors
            </p>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter">
              Real results, real competitors.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-surface-container rounded-2xl p-8 flex flex-col gap-6"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-sm"
                      style={{ color: "#FFB95F", fontVariationSettings: '"FILL" 1' }}
                    >
                      star
                    </span>
                  ))}
                </div>

                <p className="text-on-surface text-sm leading-relaxed font-body flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div>
                  <p className="font-headline font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-outline font-body">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 bg-surface text-center">
        <div className="max-w-3xl mx-auto">
          <span
            className="material-symbols-outlined text-6xl mb-6 block"
            style={{
              color: "#ADC6FF",
              fontVariationSettings: '"FILL" 1, "wght" 600',
            }}
          >
            emoji_events
          </span>
          <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Ready to{" "}
            <span className="gradient-text">Podium?</span>
          </h2>
          <p className="text-outline text-lg mb-10 font-body">
            Join thousands of DECA competitors training smarter. Free, forever.
          </p>
          <Link
            href="/signup"
            className="gradient-cta inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold font-body text-lg transition-opacity hover:opacity-90"
          >
            Get Started Free
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </Link>
          <p className="mt-6 text-xs text-outline font-body">
            No credit card required · Free forever · Works on any device
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
