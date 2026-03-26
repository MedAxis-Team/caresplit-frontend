import { Link } from "react-router-dom";
import CareSplitLogo from "@/components/CareSplitLogo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/"><CareSplitLogo /></Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <Link to="/provider/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">For Providers</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/onboarding"><Button size="sm" className="rounded-full px-6">Get Started</Button></Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border p-4 space-y-3 bg-background">
          <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground">How it works</a>
          <a href="#features" className="block text-sm font-medium text-muted-foreground">Features</a>
          <div className="flex gap-2 pt-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/onboarding"><Button size="sm" className="rounded-full">Get Started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
