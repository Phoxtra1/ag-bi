import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { exportSectionsAsCSV, exportSectionsAsPDF, type ExportSection } from "@/lib/intelligence/exportUtils";

interface Props {
  title: string;
  filenameBase: string;
  sections: ExportSection[];
  disabled?: boolean;
}

const ExportMenu: React.FC<Props> = ({ title, filenameBase, sections, disabled }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" disabled={disabled}>
        <Download className="w-4 h-4 mr-2" /> Export
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => exportSectionsAsCSV(filenameBase, sections)}>
        <FileSpreadsheet className="w-4 h-4 mr-2" /> Download CSV
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => exportSectionsAsPDF(title, filenameBase, sections)}>
        <FileText className="w-4 h-4 mr-2" /> Download PDF
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ExportMenu;
