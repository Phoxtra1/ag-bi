import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { BriefcaseBusiness, GraduationCap, FileCheck2, Plane, FileText } from "lucide-react";

const serviceAreas = [
  { icon: GraduationCap, title: "Career and Education", text: "Career reports, educational pathways, career change, opportunities and one-on-one sessions." },
  { icon: BriefcaseBusiness, title: "Business Information", text: "Business research, market context, organizational information and opportunity assessment." },
  { icon: FileText, title: "Contracts and Commitments", text: "Information and assessment relating to agreements, obligations and commitments." },
  { icon: Plane, title: "Travel and Relocation", text: "Information to support travel, relocation and related planning decisions." },
  { icon: FileCheck2, title: "Info and Report Verification", text: "Review information, documents, claims and reports for accuracy and supporting evidence." },
];

const Contact: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">Professional information services</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">InfoService</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">For requests that need professional research, consultation or a tailored engagement, tell us what you need. We assess the request, discuss the scope, and provide a quotation before work begins.</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <h2 className="text-xl font-semibold">Service areas</h2>
          <div className="mt-5 space-y-4">
            {serviceAreas.map((item) => {
              const Icon = item.icon;
              return <div key={item.title} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <div className="h-fit rounded-lg bg-teal-500/10 p-2.5 text-teal-700"><Icon size={20} /></div>
                <div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p></div>
              </div>;
            })}
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-muted-foreground dark:bg-slate-900/40">
            <strong className="text-foreground">How engagements proceed:</strong> Request → Assessment → Discussion → Quotation → Invoice → Payment → Service delivery. Fees depend on the agreed scope.
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-slate-900/5 sm:p-8">
          <h2 className="text-xl font-semibold">Tell us about your request</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to submit and track your service request.</p>
          <div className="mt-6"><ContactForm /></div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
