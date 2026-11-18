import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  ArrowRight, Search, FileCheck2, BriefcaseBusiness, ShieldCheck,
  Compass, ClipboardList, CreditCard, FileText, Globe2,
} from "lucide-react";

const services = [
  {
    icon: Compass,
    title: "Info Discovery",
    description: "Explore a question, topic, opportunity or claim. Receive a structured assessment, a clear preview and a defined report scope before deciding whether to purchase the full deliverable.",
    points: ["Research and information discovery", "Analysis and contextual assessment", "Verification where evidence permits", "Pay per requested deliverable"],
    action: "Start Info Discovery",
    href: "/explore",
    featured: true,
  },
  {
    icon: BriefcaseBusiness,
    title: "InfoService",
    description: "Request a professional information service when your needs require deeper research, specialist input, consultation or direct engagement.",
    points: ["Career and Education", "Business Information", "Contracts and Commitments", "Travel and Relocation", "Info and Report Verification"],
    action: "Request a Service",
    href: "/contact",
    featured: false,
  },
];

const steps = [
  { icon: Search, title: "Submit a request", text: "Tell us what information you need and what you want to achieve." },
  { icon: ShieldCheck, title: "Assess the evidence", text: "Relevant information is researched, organized and assessed against the request." },
  { icon: CreditCard, title: "Review the scope", text: "For paid deliverables, review the preview, scope and price before proceeding." },
  { icon: FileText, title: "Receive your result", text: "Access the completed report or the agreed professional service." },
];

const Index: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <section className="relative isolate overflow-hidden bg-[#0b1b2b] text-white">
        <div className="absolute inset-0 -z-10 opacity-70" style={{
          backgroundImage: "radial-gradient(circle at 78% 20%, rgba(20,184,166,.22), transparent 32%), radial-gradient(circle at 12% 90%, rgba(245,158,11,.12), transparent 30%)"
        }} />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-teal-200">
              <Globe2 size={14} /> Amineva Global
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Information that helps you <span className="text-teal-300">understand, verify and move forward.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Information Solutions brings research, discovery, analysis and professional information services together—helping individuals and organizations make better-informed decisions.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/explore">
                <Button size="lg" className="bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400">
                  Explore information <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  Speak to our team
                </Button>
              </Link>
            </div>
            <p className="mt-7 text-sm text-slate-400">A service platform by Amineva Global · An Information Solutions Provider</p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-teal-400/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[.06] p-6 shadow-2xl backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Information workflow</p>
                  <p className="mt-1 text-xl font-semibold">From question to clarity</p>
                </div>
                <div className="rounded-xl bg-teal-400/15 p-3 text-teal-200"><FileCheck2 size={24} /></div>
              </div>
              {[
                ["01", "Discover", "Find relevant information"],
                ["02", "Assess", "Check context and evidence"],
                ["03", "Understand", "Organize findings and implications"],
                ["04", "Act", "Receive a report or expert service"],
              ].map(([n, title, body], i) => (
                <div key={n} className="flex gap-4 border-t border-white/10 py-4">
                  <span className="pt-0.5 text-xs font-bold tracking-widest text-teal-300">{n}</span>
                  <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-400">{body}</p></div>
                  {i === 3 && <ArrowRight className="ml-auto mt-1 h-4 w-4 text-teal-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">Our services</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Two ways to get the information you need.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Choose self-service discovery for a defined information request, or engage our team for work that needs a more tailored approach.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className={service.featured ? "border-teal-500/40 shadow-lg shadow-teal-900/5" : "border-border"}>
                <CardContent className="p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-700"><Icon size={26} /></div>
                    {service.featured && <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">Self-service</span>}
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-3 min-h-[76px] leading-7 text-muted-foreground">{service.description}</p>
                  <ul className="mt-6 space-y-3">
                    {service.points.map((point) => <li key={point} className="flex items-start gap-3 text-sm text-foreground/80"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />{point}</li>)}
                  </ul>
                  <Link to={service.href} className="mt-8 inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800">
                    {service.action}<ArrowRight size={16} />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">A clear process. No unnecessary complexity.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return <div key={step.title} className="rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex items-center justify-between"><Icon className="h-6 w-6 text-teal-700" /><span className="text-sm font-semibold text-amber-600">0{i + 1}</span></div>
                <h3 className="mt-5 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-[#0b1b2b] p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-teal-300"><ClipboardList size={16} /> Start with your question</div>
            <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">What information do you need to move forward?</h2>
            <p className="mt-3 leading-7 text-slate-300">Tell us what you are trying to understand. We will direct you to the right service pathway.</p>
          </div>
          <Link to="/explore"><Button size="lg" className="shrink-0 bg-teal-500 font-semibold text-slate-950 hover:bg-teal-400">Get started <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Index;
