import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Compass, FileSearch, ShieldCheck, Clock3, ArrowRight, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "general", label: "General information discovery" },
  { value: "business", label: "Business and market information" },
  { value: "career_education", label: "Career and education" },
  { value: "verification", label: "Information and report verification" },
  { value: "travel_relocation", label: "Travel and relocation" },
  { value: "other", label: "Other information request" },
];

const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { getCurrentUser().then(setUser); }, []);

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      navigate("/login?next=%2Fexplore");
      return;
    }
    if (question.trim().length < 20) {
      toast({ title: "Add more detail", description: "Please describe what you need in at least 20 characters.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("info_discovery_requests").insert({
      user_id: user.id,
      question: question.trim(),
      category,
      status: "submitted",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Request not submitted", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_.82fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em] text-teal-800"><Compass size={14} /> Info Discovery</div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Start with the information you need.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Describe the question, claim, opportunity or subject you want to understand. Your request is recorded so its scope can be assessed before any paid report is prepared.</p>

            <div className="mt-9 space-y-5">
              {[
                [FileSearch, "Research and organize", "Identify the information needed and organize relevant findings around your question."],
                [ShieldCheck, "Assess and verify", "Assess claims against available evidence. Findings are clearly marked when they are unverified or inconclusive."],
                [Clock3, "Review before payment", "For paid deliverables, review the scope, preview and quoted price before deciding to proceed."],
              ].map(([Icon, title, text]: any) => <div key={title} className="flex gap-4"><div className="rounded-xl bg-teal-500/10 p-3 text-teal-700"><Icon size={21} /></div><div><h3 className="font-semibold">{title}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
            </div>
          </div>

          <Card className="border-border shadow-lg shadow-slate-900/5">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-500/10 text-teal-700"><ShieldCheck size={28} /></div>
                  <h2 className="mt-5 text-2xl font-semibold">Request received</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Your request has been saved to your account. The next stage is scope assessment; no payment has been taken.</p>
                  <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>Submit another request</Button>
                </div>
              ) : (
                <form onSubmit={submitRequest} className="space-y-5">
                  <div><h2 className="text-xl font-semibold">What would you like to discover?</h2><p className="mt-1 text-sm text-muted-foreground">Be as specific as possible. Do not include passwords or sensitive personal information.</p></div>
                  <div className="space-y-2"><Label htmlFor="discovery-category">Request area</Label><select id="discovery-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
                  <div className="space-y-2"><Label htmlFor="discovery-question">Your question or request</Label><Textarea id="discovery-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Describe the information you need, the context and what you want to find out..." rows={7} maxLength={5000} required /><div className="text-right text-xs text-muted-foreground">{question.length}/5000</div></div>
                  <Button type="submit" disabled={submitting} className="w-full bg-teal-600 font-semibold text-white hover:bg-teal-700">{submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting request</> : <>Submit for assessment <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
                  <p className="text-center text-xs leading-5 text-muted-foreground">{user ? "Your request will be saved to your account." : "You will be asked to sign in or create an account before submitting."} Submitting a request does not charge you.</p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
