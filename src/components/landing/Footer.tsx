import CareSplitLogo from "@/components/CareSplitLogo";

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <CareSplitLogo size="sm" />
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 CareSplit Inc. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
