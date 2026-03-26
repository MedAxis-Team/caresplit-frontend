import { Bell, HelpCircle, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import avatarImg from "@/assets/avatar-jane.jpg";

interface Props {
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ onToggleSidebar }: Props) => (
  <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background">
    <div className="flex items-center gap-4">
      <button onClick={onToggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-10 w-64 rounded-full bg-muted border-0" />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="text-muted-foreground hover:text-foreground"><Bell className="h-5 w-5" /></button>
      <button className="text-muted-foreground hover:text-foreground"><HelpCircle className="h-5 w-5" /></button>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-foreground">Jane Jenkins</p>
          <p className="text-xs text-muted-foreground">Premium Member</p>
        </div>
        <img src={avatarImg} alt="Jane Jenkins" className="h-9 w-9 rounded-full object-cover" width={36} height={36} />
      </div>
    </div>
  </header>
);

export default DashboardHeader;
