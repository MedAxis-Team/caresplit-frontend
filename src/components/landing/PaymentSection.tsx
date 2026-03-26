import paymentImg from "@/assets/payment-woman.jpg";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const PaymentSection = () => (
  <section className="py-20 bg-muted/30">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src={paymentImg}
            alt="Professional extending a helping hand"
            className="rounded-2xl w-full object-cover aspect-[3/4] max-h-[500px]"
            loading="lazy"
            width={640}
            height={800}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="bg-card rounded-2xl shadow-card-hover p-8 max-w-sm w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Balance</p>
                <p className="text-3xl font-extrabold text-foreground">$4,250.00</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>

            <p className="font-semibold text-foreground mb-4">Select your monthly plan</p>

            <div className="space-y-3 mb-6">
              <div className="border-2 border-primary rounded-xl p-4 flex justify-between items-center bg-secondary/50">
                <div>
                  <p className="font-semibold text-primary">12 Months</p>
                  <p className="text-xs text-muted-foreground">0% Interest</p>
                </div>
                <p className="text-xl font-bold text-foreground">$354<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
              <div className="border border-border rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">6 Months</p>
                  <p className="text-xs text-muted-foreground">0% Interest</p>
                </div>
                <p className="text-xl font-bold text-foreground">$708<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              </div>
            </div>

            <Button className="w-full rounded-full" size="lg">Confirm Payment Plan</Button>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PaymentSection;
