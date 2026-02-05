import { motion } from "framer-motion";
import heroImage from "@/assets/hero-landscape.jpg";

export interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const HeroSection = ({
  title = "Where the Sea",
  subtitle = "Meets the Soul",
  description = "In the quiet hours of dawn, when golden light spills across the dunes, there exists a moment of perfect stillness. A place where time slows, the world softens, and every breath feels like a gentle reminder to simply be.",
  imageSrc = heroImage,
  imageAlt = "Serene coastal landscape at golden hour",
}: HeroSectionProps) => {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-foreground mb-6">
              {title}
              <span className="block text-primary">{subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-auto object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;