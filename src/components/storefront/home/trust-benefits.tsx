import { Truck, ShieldCheck, PackageCheck, Baby } from "lucide-react";

const benefits = [
  { icon: PackageCheck, text: "Cash on Delivery", from: "from-primary-50", to: "to-primary-100", color: "text-primary-600" },
  { icon: Truck, text: "সারা বাংলাদেশে ডেলিভারি", from: "from-accent-50", to: "to-accent-100", color: "text-accent-600" },
  { icon: ShieldCheck, text: "নিরাপদ শপিং অভিজ্ঞতা", from: "from-emerald-50", to: "to-emerald-100", color: "text-emerald-600" },
  { icon: Baby, text: "শুধুই বেবি প্রোডাক্ট", from: "from-rose-50", to: "to-rose-100", color: "text-rose-500" },
];

export function TrustBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {benefits.map((b) => (
          <div
            key={b.text}
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md sm:px-4"
          >
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${b.from} ${b.to} ${b.color}`}>
              <b.icon className="size-4.5" />
            </span>
            <span className="text-xs font-medium text-foreground/80 sm:text-sm">{b.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
