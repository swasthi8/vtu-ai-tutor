import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const features = [
  { icon: '📄', title: 'Smart PDF Upload', desc: 'Upload your course PDFs and let AI index them.' },
  { icon: '🧠', title: 'AI Tutor', desc: 'Ask questions and get exam-focused answers.' },
  { icon: '📝', title: 'Summary Generator', desc: 'Auto-create concise chapter summaries.' },
  { icon: '🎯', title: 'Question Generator', desc: 'Generate practice questions for exams.' },
  { icon: '💬', title: 'Chat with Notes', desc: 'Contextual chat powered by your uploads.' },
  { icon: '📊', title: 'Study Analytics', desc: 'Track progress and weak subjects.' },
];

function FeatureCards() {
  return (
    <section className="features">
      <div className="section-header">
        <p className="eyebrow">Features</p>
        <h2 className="text-3xl font-extrabold">Premium AI study toolkit</h2>
      </div>

      <div className="features-grid">
        {features.map((f, idx) => (
          <MotionLink
            to="/"
            className="feature-card"
            key={idx}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </MotionLink>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;