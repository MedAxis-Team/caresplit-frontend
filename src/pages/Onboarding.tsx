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
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="relative">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-80 object-cover"
          />
          <button
            onClick={() => navigate("/auth-choice")}
            className="absolute top-4 right-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Skip
          </button>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">{slide.title}</h2>
          <p className="text-muted-foreground text-sm mb-8">{slide.desc}</p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
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
            className="w-full rounded-full"
            size="lg"
            onClick={() => {
              if (isLast) navigate("/auth-choice");
              else setStep(step + 1);
            }}
          >
            {isLast ? "Get Started" : "Next"}
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
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
