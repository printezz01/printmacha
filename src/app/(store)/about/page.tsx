import { Printer, Leaf, Heart, Users, Target, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PrintMacha",
  description: "Learn about PrintMacha — our story, our mission, and our commitment to premium 3D printed art and decor.",
};

export default function AboutPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            About <span className="text-[var(--color-accent)]">PrintMacha</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            We believe art should be felt, not just seen. That&apos;s why we create 3D printed pieces that add real depth, texture, and character to modern Indian spaces.
          </p>
        </div>

        <div className="space-y-8 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-4">Our Story</h2>
            <p>
              PrintMacha was born from a simple frustration: why does wall art have to be flat? We started experimenting with 3D printing to create art that literally stands out — pieces with depth, shadow play, and tactile beauty.
            </p>
            <p className="mt-3">
              What began as a passion project in a small studio has grown into a brand that&apos;s redefining home decor in India. Every piece we create is 3D printed with precision, using eco-friendly materials and a whole lot of love.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6 my-12">
            <div className="p-6 rounded-xl bg-[var(--color-surface-muted)]">
              <Target className="w-8 h-8 text-[var(--color-accent)] mb-4" />
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Our Mission</h3>
              <p className="text-sm">To make premium, innovative art accessible to everyone in India — art that sparks joy and transforms spaces.</p>
            </div>
            <div className="p-6 rounded-xl bg-[var(--color-surface-muted)]">
              <Eye className="w-8 h-8 text-[var(--color-accent)] mb-4" />
              <h3 className="font-bold text-[var(--color-text-primary)] mb-2">Our Vision</h3>
              <p className="text-sm">To become India&apos;s most loved brand for 3D printed art and functional decor.</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold font-heading text-[var(--color-text-primary)] mb-6">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Printer, title: "3D Precision", desc: "Each product is printed with cutting-edge 3D printing technology for flawless detail." },
                { icon: Leaf, title: "Eco-Conscious", desc: "We use PLA, a biodegradable material derived from natural resources." },
                { icon: Heart, title: "Small Batch", desc: "Limited production runs mean each piece gets the attention it deserves." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--color-brand-orange-50)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
                  <p className="text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
