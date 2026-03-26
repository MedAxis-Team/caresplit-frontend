import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CareSplitLogo from "@/components/CareSplitLogo";

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="text-center space-y-10 max-w-md w-full">
        <div className="flex flex-col items-center gap-2">
          <CareSplitLogo size="lg" />
          <p className="text-muted-foreground text-sm mt-2">
            Healing without the financial headache.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full rounded-full text-lg py-6"
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Patient
          </Button>
          <Button
            variant="secondary"
            className="w-full rounded-full text-lg py-6 text-primary font-semibold"
            size="lg"
            onClick={() => navigate("/provider/login")}
          >
            Hospital
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
