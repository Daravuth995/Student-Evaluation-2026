import { Mic, Music2, MessageCircle, Hand, Waves, Link2 } from "lucide-react";
import type { Scores } from "../types";
import { CriterionCard } from "./CriterionCard";
import { motion } from "framer-motion";

interface Props {
  scores: Scores;
}

const CRITERIA = [
  { key: "pronunciation", label: "Pronunciation", labelKh: "ការបញ្ចេញសំឡេង", icon: Mic },
  { key: "intonation", label: "Intonation", labelKh: "សំឡេងឡើងចុះ", icon: Music2 },
  { key: "communication", label: "Communication", labelKh: "ការទំនាក់ទំនង", icon: MessageCircle },
  { key: "participation", label: "Participation", labelKh: "ការចូលរួម", icon: Hand },
  { key: "risingFalling", label: "Rising & Falling", labelKh: "សំឡេងឡើងចុះ", icon: Waves },
  { key: "linkingSounds", label: "Linking Sounds", labelKh: "ការតភ្ជាប់សំឡេង", icon: Link2 },
] as const;

export function CriteriaGrid({ scores }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <div className="flex items-baseline justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl font-bold text-white text-shadow-lg">
            Performance by Criterion
          </h2>
          <p className="khmer text-sm text-white/80 text-shadow-lg">
            លទ្ធផលតាមលក្ខណៈវិនិច្ឆ័យ
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CRITERIA.map((c, i) => (
          <CriterionCard
            key={c.key}
            icon={c.icon}
            label={c.label}
            labelKh={c.labelKh}
            score={scores[c.key]}
            delay={i * 0.08}
          />
        ))}
      </div>
    </motion.section>
  );
}
