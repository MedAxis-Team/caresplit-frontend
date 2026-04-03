import { CheckCircle2, Building2, ShieldCheck, Heart } from "lucide-react";
import featuresImg from "@/assets/features-doctor.jpg";
import paymentImg from "@/assets/payment-woman.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: CheckCircle2, title: "Zero hidden fees, ever", desc: "What you see is what you pay. We never charge late fees, interest, or origination fees.", bg: "bg-green-100", color: "text-green-600" },
  { icon: Building2, title: "Works with any hospital", desc: "Whether your provider is in our network or not, you can split your bill.", bg: "bg-purple-100", color: "text-purple-600" },
  { icon: ShieldCheck, title: "Hardship protection", desc: "Life happens. Pause or adjust your payment plan if you experience financial hardship.", bg: "bg-green-100", color: "text-green-600" },
];

const PaymentCard = () => (
  <div className="bg-card rounded-2xl border border-border p-6 shadow-lg max-w-sm w-full h-fit mt-0 lg:mt-40">
    <div className="flex items-center justify-between mb-0 lg:mb-8">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
        <p className="text-3xl font-extrabold text-foreground">$4,250.00</p>
      </div>
      <Heart className="h-8 w-8 text-primary" />
    </div>
    <p className="font-semibold text-foreground mb-3">Select your monthly plan</p>
    <div className="space-y-2 mb-12">
      <div className="border-2 border-primary rounded-xl p-3 flex justify-between items-center bg-secondary/50">
        <div>
          <p className="font-semibold text-primary">12 Months</p>
          <p className="text-xs text-muted-foreground">0% Interest</p>
        </div>
        <p className="text-xl font-bold text-foreground">$354<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
      </div>
      <div className="border border-border rounded-xl p-3 flex justify-between items-center">
        <div>
          <p className="font-semibold text-foreground">6 Months</p>
          <p className="text-xs text-muted-foreground">0% Interest</p>
        </div>
        <p className="text-xl font-bold text-foreground">$708<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
      </div>
    </div>
    <Button className="w-full rounded-full" size="lg">Confirm Payment Plan</Button>
  </div>
);

const FeaturesSection = () => (
  <section id="features" className="pt-20 pb-10">
    <div className="container">
      {/* Desktop: 2-column grid */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-8">
        {/* Top-left: Text + features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 italic leading-tight">
            Designed for patients,<br />built for peace of mind.
          </h2>
          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top-right: Doctor image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <img
            src={featuresImg}
            alt="Doctor consulting with patient"
            className="rounded-2xl w-full object-cover"
            style={{ height: '420px' }}
            loading="lazy"
          />
        </motion.div>

        {/* Bottom-left: Smiling woman image - taller and moved up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: -80 }} // move up more
          viewport={{ once: true }}
        >
          <img
            src={paymentImg}
            alt="Smiling woman"
            className="rounded-2xl w-full object-cover"
            style={{ height: '600px' }} // taller image
            loading="lazy"
          />
        </motion.div>

        {/* Bottom-right: Payment card - moderate length */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 20 }} // slightly move down
          viewport={{ once: true }}
          className="flex justify-start"
        >
          <PaymentCard />
        </motion.div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 italic leading-tight">
            Designed for patients,<br />built for peace of mind.
          </h2>
          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Doctor image shown on mobile, payment-woman hidden */}
        <img src={featuresImg} alt="Doctor consulting with patient" className="rounded-2xl w-full object-cover aspect-[4/3]" loading="lazy" />
        <div className="flex justify-center">
          <PaymentCard />
        </div>
      </div>
    </div>
  </section>
);

export default FeaturesSection;