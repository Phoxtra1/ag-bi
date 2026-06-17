import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Rss, Inbox, Zap, Activity, BarChart3 } from "lucide-react";

const STORAGE_KEY = "abi.admin.walkthrough.v1.done";

interface Step {
  title: string;
  body: string;
  icon: React.ReactNode;
  jumpTo?: string;
  jumpLabel?: string;
}

const STEPS: Step[] = [
  {
    title: "Welcome, system admin",
    body: "This 60-second tour shows how ABI's user experience depends on the data you ingest here. If admins don't publish signals, every user dashboard module will display 'no data' empty states.",
    icon: <ShieldCheck className="text-primary" size={22} />,
  },
  {
    title: "1 — Intelligence Health is your scoreboard",
    body: "Open Intelligence Health to see live counts for the seven core collections that power user modules: markets, competitors, opportunities, buyer requests, seller listings, risk alerts and published reports. Empty collections directly cause empty user tabs.",
    icon: <Activity className="text-primary" size={22} />,
    jumpTo: "intelligence",
    jumpLabel: "Open Intelligence Health",
  },
  {
    title: "2 — Ingest signals via Intelligence Sources",
    body: "Use Intelligence Sources to register feeds and trigger pulls into markets, competitors and risk alerts. New records flow straight into the Market, Competitor and Executive Overview tabs of every user.",
    icon: <Rss className="text-primary" size={22} />,
    jumpTo: "feed-sources",
    jumpLabel: "Open Intelligence Sources",
  },
  {
    title: "3 — Approve user submissions",
    body: "Submission Queue holds opportunities, buyer/seller records and report drafts submitted by users or partners. Only approved items become visible to end users — this is the gate on Opportunity, Buyer/Seller and Reports tabs.",
    icon: <Inbox className="text-primary" size={22} />,
    jumpTo: "content-inbox",
    jumpLabel: "Open Submission Queue",
  },
  {
    title: "4 — Tune Intelligence Engines",
    body: "Intelligence Engines control scoring, training and AI routing. Engines convert raw signals into the rankings, threat bands and forecasts users see in Market/Competitor/Opportunity modules.",
    icon: <Zap className="text-primary" size={22} />,
    jumpTo: "ai-engines",
    jumpLabel: "Open Engines",
  },
  {
    title: "Empty user dashboards = unfilled admin queues",
    body: "If a user reports a blank Market, Competitor, Opportunity or Reports view, come back to Intelligence Health first. Anything marked 'empty' or 'missing' points to the exact admin tab that needs attention. You can replay this tour any time.",
    icon: <BarChart3 className="text-primary" size={22} />,
  },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate?: (tabId: string) => void;
}

const AdminWalkthroughDialog: React.FC<Props> = ({ open, onOpenChange, onNavigate }) => {
  const [i, setI] = useState(0);
  useEffect(() => { if (open) setI(0); }, [open]);

  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;

  const finish = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) finish(); else onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step.icon}
            <DialogTitle>{step.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 leading-relaxed">{step.body}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-1 my-2">
          {STEPS.map((_, idx) => (
            <span key={idx} className={`h-1.5 flex-1 rounded-full ${idx <= i ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={finish}>Skip tour</Button>
          <div className="flex gap-2">
            {step.jumpTo && onNavigate && (
              <Button variant="outline" size="sm" onClick={() => { onNavigate(step.jumpTo!); finish(); }}>
                {step.jumpLabel ?? "Open"}
              </Button>
            )}
            {i > 0 && <Button variant="outline" size="sm" onClick={() => setI(i - 1)}>Back</Button>}
            {!isLast
              ? <Button size="sm" onClick={() => setI(i + 1)}>Next</Button>
              : <Button size="sm" onClick={finish}>Finish</Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const hasSeenAdminWalkthrough = () => {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
};
export const resetAdminWalkthrough = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
};

export default AdminWalkthroughDialog;
