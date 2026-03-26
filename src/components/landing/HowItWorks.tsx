import { Upload, BarChart3, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Upload, title: "Upload Your Bill", desc: "Link your hospital account or simply upload a photo of your medical bill." },
  { icon: BarChart3, title: "Choose Your Plan", desc: "Select a 3, 6, or 12-month installment plan that fits your monthly budget." },
  { icon: CreditCard, title: "Pay Over Time", desc: "Make manageable zero-interest payments until your balance is cleared." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-muted/30">
    <div className="container text-center">
      <h2 className="text-3xl font-bold text-foreground mb-3">How CareSplit Works</h2>
      <p className="text-muted-foreground mb-12">Three simple steps to manage your medical expenses without the financial stress.</p>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
        {/* Connecting lines between steps */}
        <div className="hidden md:block absolute top-8 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-[2px] border-t-2 border-dashed border-border z-0" />

        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            className="flex flex-col items-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
