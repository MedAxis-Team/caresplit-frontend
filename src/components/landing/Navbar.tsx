import { Link } from "react-router-dom";
import CareSplitLogo from "@/components/CareSplitLogo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><CareSplitLogo /></Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <Link to="/provider/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">For Providers</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth-choice?mode=login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/onboarding"><Button size="sm" className="rounded-full px-6">Get Started</Button></Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — full-screen overlay */}
      {open && (
        <>
          <div className="fixed inset-0 top-16 bg-black/30 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="fixed top-16 left-0 right-0 z-50 md:hidden bg-background border-b border-border shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col p-5 space-y-1">
              <a href="#how-it-works" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">How it works</a>
              <a href="#features" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">Features</a>
              <Link to="/provider/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">For Providers</Link>
              <div className="border-t border-border my-2" />
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/auth-choice?mode=login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl" size="lg">Log in</Button>
                </Link>
                <Link to="/onboarding" onClick={() => setOpen(false)}>
                  <Button className="w-full rounded-xl" size="lg">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
