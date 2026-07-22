import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics } from '../services/api';

const defaultMetrics = [
  { label: 'Upload rate', value: '0 PDFs / month' },
  { label: 'Average answer time', value: '—' },
  { label: 'Quiz attempts', value: '0' },
  { label: 'Flashcards generated', value: '0' },
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((data) => setAnalytics(data))
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, []);

  const metrics = analytics
    ? [
        { label: 'Upload rate', value: analytics.upload_rate },
        { label: 'Average answer time', value: analytics.average_answer_time },
        { label: 'Quiz attempts', value: analytics.quiz_attempts },
        { label: 'Flashcards generated', value: analytics.flashcards_generated },
      ]
    : defaultMetrics;

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-[32px] border border-white/10 shadow-2xl p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Analytics</p>
            <h1 className="mt-4 text-4xl font-bold text-white">AI-powered learning insights</h1>
            <p className="mt-4 text-slate-300 max-w-2xl">Track your upload activity, quiz performance, and AI tutoring usage. Semester Companion AI turns your study data into clear trends.</p>
          </div>
          <div className="rounded-3xl bg-slate-950/60 border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Next milestone</p>
            <p className="mt-3 text-2xl font-semibold text-white">Publish your summary notes</p>
            <p className="mt-2 text-slate-300">Improve recall by reviewing summaries after every upload.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="glass rounded-3xl border border-white/10 p-6 shadow-xl">
              <p className="text-sm text-slate-400">{metric.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Top performing subject</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">{loading ? 'Loading...' : analytics?.top_subject ?? 'No subject yet'}</h2>
            <p className="mt-4 text-slate-300">{loading ? 'Loading insight...' : `Your latest PDF is focused on ${analytics?.top_subject ?? 'your study material'}.`}</p>
          </div>
          <div className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Review cadence</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">{loading ? 'Loading...' : analytics?.review_cadence ?? '0 revision sessions / week'}</h2>
            <p className="mt-4 text-slate-300">{loading ? 'Fetching your latest study cadence...' : 'Use flashcards and quizzes regularly to maintain this pace.'}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
