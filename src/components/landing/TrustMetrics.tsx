import { motion } from "framer-motion";

const metrics = [
  { value: "$50M+", label: "Medical Bills Managed" },
  { value: "200k+", label: "Patients Helped" },
  { value: "0%", label: "Interest Rates" },
  { value: "500+", label: "Partner Hospitals" },
];

const TrustMetrics = () => (
  <section className="py-8 md:py-16 border-y border-border">
    <div className="container">
      <p className="text-center text-sm font-semibold text-primary mb-8">
        Trusted by patients and healthcare providers nationwide
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            className={`text-center px-6 ${i < metrics.length - 1 ? "md:border-r md:border-border" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-3xl lg:text-4xl font-extrabold text-foreground">{m.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustMetrics;
