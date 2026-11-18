import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, FileText, MessageSquareText } from "lucide-react";

const Pricing: React.FC = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-teal-700">Transparent engagement</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Pay for the work you need.</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Information Solutions is designed around individual requests and clearly scoped professional engagements—not a compulsory monthly subscription.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-teal-500/40 shadow-lg shadow-teal-900/5">
          <CardContent className="p-8">
            <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-700 w-fit"><FileText size={26} /></div>
            <h2 className="mt-6 text-2xl font-semibold">Info Discovery</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Submit a request at no charge. After the request is assessed, you receive an appropriate preview, defined deliverable scope and price before choosing to proceed with the full report.</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li>• No mandatory subscription</li>
              <li>• Price set according to request scope</li>
              <li>• Payment is required before full paid report release</li>
            </ul>
            <Link to="/explore" className="mt-8 inline-flex items-center gap-2 font-semibold text-teal-700">Start a request <ArrowRight size={16} /></Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-700 w-fit"><MessageSquareText size={26} /></div>
            <h2 className="mt-6 text-2xl font-semibold">InfoService</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Professional and consultative engagements are assessed individually. The scope may include research, meetings, specialist review, interviews or institutional engagement where needed.</p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/80">
              <li>• Request assessment first</li>
              <li>• Discussion and scope confirmation</li>
              <li>• Individual quotation and invoice</li>
            </ul>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 font-semibold text-teal-700">Discuss a service <ArrowRight size={16} /></Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 rounded-2xl bg-slate-50 p-6 dark:bg-slate-900/40">
        <div className="flex items-start gap-4">
          <ClipboardCheck className="mt-1 h-6 w-6 shrink-0 text-teal-700" />
          <div><h3 className="font-semibold">You review the scope before committing.</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">The cost depends on the subject, depth, evidence requirements, deliverable and level of professional involvement. No fixed price is promised for work that has not yet been assessed.</p></div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Pricing;
