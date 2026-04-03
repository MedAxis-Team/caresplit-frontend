import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CareSplitLogo from "@/components/CareSplitLogo";
import { ArrowLeft } from "lucide-react";

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Back arrow — top-left, navigates to landing page */}
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

      {/* Full-width buttons */}
      <div className="w-full max-w-sm sm:max-w-md space-y-4">
        <Button
          variant="secondary"
          className="w-full rounded-xl text-base sm:text-lg py-6 sm:py-7 bg-gray-200 text-foreground font-semibold hover:bg-gray-300 transition-all"
          size="lg"
          onClick={() => navigate("/signup")}
        >
          Patient
        </Button>
        <Button
          className="w-full rounded-xl text-base sm:text-lg py-6 sm:py-7 bg-[#2D0A6E] text-white font-semibold hover:bg-[#3D1A8E] transition-all"
          size="lg"
          onClick={() => navigate("/provider/login")}
        >
          Hospital
        </Button>
      </div>

      {/* Footer text */}
      <p className="text-xs text-muted-foreground mt-10 sm:mt-16 text-center">
        By continuing, you agree to our Terms of Service & Privacy Policy
      </p>
    </div>
  );
};

export default AuthChoice;
