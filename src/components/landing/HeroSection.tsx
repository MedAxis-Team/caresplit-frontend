import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import heroImage from "@/assets/heroImage.png";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="grid lg:grid-cols-2 min-h-screen">
      <div className="relative z-10 flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground mb-6">
            💜 Healthcare financing, reimagined
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
            Focus on healing,<br />
            not <span className="text-primary">hospital bills.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mb-8">
            Split your medical expenses into flexible, transparent, zero-interest monthly payments. No hidden fees, no credit damage.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/onboarding">
              <Button size="lg" className="rounded-full px-8 shadow-purple">
                Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" /> No impact on credit score
            </span>
          </div>
        </motion.div>
      </div>

      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10" />
        <img
          src={heroImage}
          alt="Healthcare professional smiling"
          className="h-full w-full object-cover"
          width={800}
          height={960}
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
