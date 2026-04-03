import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import onboarding1 from "@/assets/onboarding-1.jpg";
import onboarding2 from "@/assets/onboarding-2.jpg";
import onboarding3 from "@/assets/onboarding-3.jpg";

const slides = [
  {
    image: onboarding1,
    title: "Focus on Healing, Not Bills",
    desc: "Get the medical care you need today and pay your hospital bills over time.",
  },
  {
    image: onboarding2,
    title: "Flexible Payment Plans",
    desc: "Choose an installment plan that fits your budget. 3, 6, or 12 months options available.",
  },
  {
    image: onboarding3,
    title: "Secure & Transparent",
    desc: "No hidden fees. Total transparency. We protect your financial and healthcare data.",
  },
];

const AUTO_ADVANCE_MS = 3500;

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [autoKey, setAutoKey] = useState(0); // reset auto-timer on manual click
  const navigate = useNavigate();
  const isLast = step === slides.length - 1;
  const slide = slides[step];

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLast) navigate("/auth-choice?mode=signup");
      else setStep((s) => s + 1);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [step, autoKey, isLast, navigate]);

  const goNext = () => {
    if (isLast) navigate("/auth-choice?mode=signup");
    else {
      setStep((s) => s + 1);
      setAutoKey((k) => k + 1); // reset auto-timer
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-secondary/30 overflow-hidden">
      {/* Left: Image — desktop only, full-bleed */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            style={{ minHeight: '100vh' }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-background min-h-screen">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/auth-choice?mode=signup")}
            className="absolute top-6 right-6 text-sm font-medium text-muted-foreground hover:text-foreground z-10"
          >
            Skip
          </button>

          {/* Mobile: image fills full width, cropped to show face */}
          <div className="md:hidden mb-6 rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="w-full h-56 sm:h-72 object-cover object-top"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-left">{slide.title}</h2>
              <p className="text-muted-foreground text-base mb-8 text-left">{slide.desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots — animated */}
          <div className="flex gap-2 mb-8">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => { setStep(i); setAutoKey((k) => k + 1); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button className="w-full rounded-full mb-4" size="lg" onClick={goNext}>
            {isLast ? "Get Started" : "Next"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
