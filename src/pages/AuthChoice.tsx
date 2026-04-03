import { useNavigate, Link, useSearchParams } from "react-router-dom";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft } from "lucide-react";

const AuthChoice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signup"; // "login" or "signup"

  const patientPath = mode === "login" ? "/login" : "/signup";
  const providerPath = mode === "login" ? "/provider/login" : "/provider/register";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Back arrow */}
      <Link
        to="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Logo + tagline */}
      <div className="flex flex-col items-center gap-3 mb-12 sm:mb-16">
        <CareSplitLogo size="lg" />
        <p className="text-muted-foreground text-sm sm:text-base text-center max-w-xs">
          Healing without the financial headache.
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm sm:max-w-md space-y-4">
        <button
          className="w-full rounded-xl text-base sm:text-lg py-6 sm:py-7 bg-gray-200 text-foreground font-semibold hover:bg-gray-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
          onClick={() => navigate(patientPath)}
        >
          Patient
        </button>
        <button
          className="w-full rounded-xl text-base sm:text-lg py-6 sm:py-7 bg-[#2D0A6E] text-white font-semibold hover:bg-[#3D1A8E] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
          onClick={() => navigate(providerPath)}
        >
          Hospital
        </button>
      </div>

      {/* Footer text */}
      <p className="text-xs text-muted-foreground mt-10 sm:mt-16 text-center">
        By continuing, you agree to our Terms of Service &amp; Privacy Policy
      </p>
    </div>
  );
};

export default AuthChoice;
