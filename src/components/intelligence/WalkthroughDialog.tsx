import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, Globe2, Radar, Target, Handshake, FileText, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "abi.walkthrough.v1.done";

interface Step {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Welcome to ABI",
    body: "Amineva Business Intelligence turns your numbers and the market's signals into clear scores, opportunities and risks. This 60-second tour shows where things live and how each module starts producing value.",
    icon: <CheckCircle2 className="text-primary" size={22} />,
  },
  {
    title: "1 — Enter your Business data first",
    body: "Open the Business tab. Either fill in one period of revenue, expenses, sales, customers, inventory and ops, or use Import → Download template to bulk-load a CSV. As soon as one period is saved, KPIs, trends and the Executive Overview light up.",
    icon: <BarChart3 className="text-primary" size={22} />,
  },
  {
    title: "2 — Market, Competitor, Opportunity, Buyer/Seller",
    body: "These read from shared intelligence collections. They populate as the admin team ingests feeds and verified records. If a tab is empty today, it just means no signals have been published yet for your industry/region.",
    icon: <Globe2 className="text-primary" size={22} />,
  },
  {
    title: "3 — Reports & Executive Overview",
    body: "Reports surface published intelligence (industry, market, country, risk, opportunity, competitor). Executive Overview blends your Business KPIs with market signals to give you the daily scoreboard.",
    icon: <FileText className="text-primary" size={22} />,
  },
  {
    title: "4 — Export, Predict, Verify",
    body: "Every module has an Export button (CSV/PDF). Use Predictions to request forecasts and Verify to submit information for analysis. You can replay this tour any time from the Overview tab.",
    icon: <Target className="text-primary" size={22} />,
  },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onJumpToBusiness?: () => void;
}

const WalkthroughDialog: React.FC<Props> = ({ open, onOpenChange, onJumpToBusiness }) => {
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
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${idx <= i ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={finish}>Skip tour</Button>
          <div className="flex gap-2">
            {i > 0 && (
              <Button variant="outline" size="sm" onClick={() => setI(i - 1)}>Back</Button>
            )}
            {!isLast ? (
              <Button size="sm" onClick={() => setI(i + 1)}>Next</Button>
            ) : (
              <>
                {onJumpToBusiness && (
                  <Button size="sm" variant="outline" onClick={() => { finish(); onJumpToBusiness(); }}>
                    Go to Business
                  </Button>
                )}
                <Button size="sm" onClick={finish}>Finish</Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const hasSeenWalkthrough = () => {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
};

export const resetWalkthrough = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
};

export default WalkthroughDialog;
