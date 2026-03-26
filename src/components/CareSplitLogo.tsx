import logoIcon from "@/assets/logo-icon.png";

interface CareSplitLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

const CareSplitLogo = ({ size = "md", variant = "default" }: CareSplitLogoProps) => {
  const sizes = { sm: "h-6", md: "h-8", lg: "h-10" };
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };

  return (
    <div className="flex items-center gap-2">
      <img src={logoIcon} alt="CareSplit" className={`${sizes[size]} w-auto`} />
      <span className={`${textSizes[size]} font-bold ${variant === "white" ? "text-primary-foreground" : "text-foreground"}`}>
        Care<span className="text-primary">Split</span>
      </span>
    </div>
  );
};

export default CareSplitLogo;
