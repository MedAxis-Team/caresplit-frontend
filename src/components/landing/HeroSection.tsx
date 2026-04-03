import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import heroPatient from "@/assets/hero-patient.jpg";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative overflow-hidden bg-background">
    <div className="grid lg:grid-cols-2 h-auto lg:h-[calc(100vh-4rem)]">
      {/* Left: Text content */}
      <div className="relative z-10 flex flex-col justify-start px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 lg:pt-20 pb-10 lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold text-primary tracking-wide">
            💜 Healthcare financing, reimagined
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mt-8 mb-4">
            Focus on healing,<br />
            not <span className="text-primary">hospital bills.</span>
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-sm lg:max-w-md">
            Split your medical expenses into flexible, zero-interest monthly payments — with no hidden fees and no credit impact.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8">
            <Link to="/auth-choice?mode=signup">
              <Button size="lg" className="rounded-full px-8 shadow-md">
                Check Your Eligibility <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
              No impact on credit score
            </span>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-xs text-muted-foreground">
            <span>✓ 0% interest, always</span>
            <span>✓ 3, 6 or 12-month plans</span>
            <span>✓ Works at any hospital</span>
          </div>
        </motion.div>
      </div>

      {/* Right: Hero image — constrained to viewport height */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-10" />
        <img
          src={heroPatient}
          alt="Patient receiving healthcare"
          className="absolute inset-0 h-full w-full object-cover object-top"
          width={800}
          height={960}
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
