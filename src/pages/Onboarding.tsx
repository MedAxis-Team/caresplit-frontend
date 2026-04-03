import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isLast = step === slides.length - 1;
  const slide = slides[step];

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-secondary/30 overflow-hidden">
      {/* Left: Image — desktop only, full-bleed */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-card">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover max-h-screen"
          style={{ minHeight: '100vh' }}
        />
      </div>
      {/* Right: Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-background min-h-screen">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/auth-choice")}
            className="absolute top-6 right-6 text-sm font-medium text-muted-foreground hover:text-foreground z-10"
          >
            Skip
          </button>

          {/* Mobile: image shown in a rounded card — object-top keeps faces in frame */}
          <div className="md:hidden mb-6 rounded-2xl overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-52 sm:h-64 object-cover object-top"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-left">{slide.title}</h2>
          <p className="text-muted-foreground text-base mb-10 text-left">{slide.desc}</p>

          {/* Dots */}
          <div className="flex gap-2 mb-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            className="w-full rounded-full mb-4"
            size="lg"
            onClick={() => {
              if (isLast) navigate("/auth-choice");
              else setStep(step + 1);
            }}
          >
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
