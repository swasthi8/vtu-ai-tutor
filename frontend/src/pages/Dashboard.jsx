import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { getNotesList } from '../services/api';

const trendData = [
  { name: 'Mon', value: 48 },
  { name: 'Tue', value: 56 },
  { name: 'Wed', value: 72 },
  { name: 'Thu', value: 84 },
  { name: 'Fri', value: 78 },
  { name: 'Sat', value: 92 },
  { name: 'Sun', value: 86 },
];

const radarData = [
  { subject: 'Math', score: 90 },
  { subject: 'Physics', score: 82 },
  { subject: 'CS', score: 88 },
  { subject: 'Electronics', score: 74 },
  { subject: 'Mechanics', score: 80 },
];

const progressData = [
  { name: 'Completed', value: 68 },
  { name: 'Remaining', value: 32 },
];

const COLORS = ['#2563EB', '#475569'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    note_count: 0,
    upload_rate: '0 PDFs / month',
    average_answer_time: '—',
    quiz_attempts: 0,
    flashcards_generated: 0,
    top_subject: 'No subject yet',
    review_cadence: '0 revision sessions / week',
    last_upload: null,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const noteData = await getNotesList();
        const notes = noteData.notes || [];
        const noteCount = notes.length;
        const topSubject = noteCount ? notes[noteCount - 1].filename.split('.')[0] : 'No subject yet';
        const firstUpload = notes.length ? new Date(notes[0].uploaded_at) : null;
        const lastUpload = notes.length ? notes[noteCount - 1].uploaded_at : null;
        const days = firstUpload ? Math.max(1, Math.round((Date.now() - firstUpload.getTime()) / 86400000)) : 1;
        const uploadRate = noteCount ? `${Math.round((noteCount / days) * 30)} PDFs / month` : '0 PDFs / month';

        setSummary((current) => ({
          ...current,
          note_count: noteCount,
          upload_rate: uploadRate,
          top_subject: topSubject,
          last_upload: lastUpload,
        }));
      } catch (error) {
        console.error('Dashboard load failed', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      <div className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Dashboard</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-white">Study metrics for the week</h1>
            <p className="mt-4 max-w-2xl text-slate-300">A quick view of your study progress, uploads, and AI-powered revision support.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-3xl p-5 border border-white/10 shadow-xl">
              <p className="text-sm text-slate-400">Notes Uploaded</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? 'Loading...' : summary.note_count}</p>
              <p className="mt-2 text-slate-300">Total PDF uploads so far</p>
            </div>
            <div className="glass rounded-3xl p-5 border border-white/10 shadow-xl">
              <p className="text-sm text-slate-400">Average Answer Time</p>
              <p className="mt-3 text-3xl font-semibold text-white">{loading ? 'Loading...' : summary.average_answer_time}</p>
              <p className="mt-2 text-slate-300">Speed of your AI quiz responses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mt-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Study trend</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Hours studied</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-400">Upload rate</p>
                <p className="mt-2 text-xl font-semibold text-white">{loading ? 'Loading...' : summary.upload_rate}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-400">Top subject</p>
                <p className="mt-2 text-xl font-semibold text-white">{loading ? 'Loading...' : summary.top_subject}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/50 p-4">
                <p className="text-xs uppercase text-slate-400">Streak</p>
                <p className="mt-2 text-xl font-semibold text-white">14 days</p>
              </div>
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={3} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Performance</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Skill radar</h2>
            </div>
          </div>
          <div className="mt-8 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={120}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#22C55E" fill="#22C55E" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-[0.9fr_0.6fr]">
        <div className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Progress</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Semester completion</h2>
            </div>
            <p className="text-sm text-slate-300">{loading ? 'Loading...' : `${summary.note_count} notes indexed`}</p>
          </div>
          <div className="mt-8 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={progressData} innerRadius="70%" outerRadius="90%" dataKey="value" startAngle={90} endAngle={450}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Recent activity</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Latest study updates</h2>
          <ul className="mt-8 space-y-4 text-slate-300">
            <li className="rounded-3xl bg-slate-950/40 p-4">{loading ? 'Loading activity...' : `Uploaded latest note: ${summary.top_subject}`}</li>
            <li className="rounded-3xl bg-slate-950/40 p-4">{loading ? 'Loading activity...' : `Quiz attempts: ${summary.quiz_attempts}`}</li>
            <li className="rounded-3xl bg-slate-950/40 p-4">{loading ? 'Loading activity...' : `Flashcards generated: ${summary.flashcards_generated}`}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
