import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ctaImage from "@/assets/cta-family.jpg";

const CTABanner = () => (
  <section className="pt-6 pb-16">
    <div className="container">
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center">
        <img
          src={ctaImage}
          alt="Happy family"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          width={1280}
          height={512}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
        <div className="relative z-10 p-8 lg:p-16 max-w-lg">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-3">
            Ready to take control of your healthcare costs?
          </h2>
          <p className="text-primary-foreground/80 mb-6 text-sm">
            Join thousands of patients who have eliminated medical debt stress with CareSplit.
          </p>
          <Link to="/onboarding">
            <Button size="lg" className="rounded-full px-8">Get Started for Free</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTABanner;
