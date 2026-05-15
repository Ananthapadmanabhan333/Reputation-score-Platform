import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Award, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateScore, generateMockData, ScoreBreakdown } from './logic/scoring';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const App = () => {
  const [interactions, setInteractions] = useState(generateMockData(20));
  const [score, setScore] = useState<ScoreBreakdown | null>(null);

  useEffect(() => {
    setScore(calculateScore(interactions));
  }, [interactions]);

  const chartData = {
    labels: ['Reliability', 'Professionalism', 'Consistency'],
    datasets: [
      {
        label: 'Trust Profile',
        data: score ? [score.reliability, score.professionalism, score.consistency] : [0, 0, 0],
        backgroundColor: 'rgba(0, 242, 255, 0.2)',
        borderColor: '#00f2ff',
        borderWidth: 2,
        pointBackgroundColor: '#00f2ff',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#a0a0a0', font: { size: 14 } },
        suggestedMin: 0,
        suggestedMax: 1000,
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  if (!score) return null;

  return (
    <div className="dashboard-container">
      <header className="header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', fontWeight: 900 }}>REPUTATION SCORE PLATFORM</h1>
          <p className="stat-label">Advanced Reputation Protocol</p>
        </motion.div>
      </header>

      <div className="grid-layout">
        {/* Main Score Card */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{ gridColumn: 'span 2' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-label">Aggregate Trust Score</div>
              <div className="stat-value gradient-text" style={{ fontSize: '5rem' }}>{score.overall}</div>
              <div className={`badge badge-${score.tier.toLowerCase()}`}>{score.tier} Tier</div>
            </div>
            <div style={{ width: '300px', height: '300px' }}>
              <Radar data={chartData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        {/* Anti-Gaming Status */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck color="#00f2ff" /> Integrity Guard
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">Sybil Resistance</span>
              <span style={{ color: '#00ff88' }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">RWF Weighting</span>
              <span>1.84x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="stat-label">Anomaly Score</span>
              <span style={{ color: '#00ff88' }}>0.02 (Low)</span>
            </div>
          </div>
        </motion.div>

        {/* Pillars */}
        {[
          { label: 'Reliability', value: score.reliability, icon: <Zap size={20} />, color: '#00f2ff' },
          { label: 'Professionalism', value: score.professionalism, icon: <Award size={20} />, color: '#7000ff' },
          { label: 'Consistency', value: score.consistency, icon: <Target size={20} />, color: '#ff00c8' }
        ].map((pillar, idx) => (
          <motion.div 
            key={pillar.label}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ color: pillar.color }}>{pillar.icon}</div>
              <span className="stat-label">{pillar.label}</span>
            </div>
            <div className="stat-value" style={{ fontSize: '2rem' }}>{pillar.value}</div>
            <div className="pillar-bar">
              <motion.div 
                className="pillar-fill" 
                initial={{ width: 0 }}
                animate={{ width: `${pillar.value / 10}%` }}
                style={{ background: pillar.color }}
              />
            </div>
          </motion.div>
        ))}

        {/* Data Inputs Simulation */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ gridColumn: 'span 3' }}
        >
          <h3 style={{ marginBottom: '1.5rem' }}>Real-time Signal Intelligence</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <div className="stat-label">Response Latency</div>
              <div style={{ fontWeight: 600 }}>14.2 mins</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <div className="stat-label">SLA Adherence</div>
              <div style={{ fontWeight: 600 }}>98.4%</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <div className="stat-label">Feedback Sentiment</div>
              <div style={{ fontWeight: 600, color: '#00ff88' }}>Highly Positive</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
              <div className="stat-label">Network Trust</div>
              <div style={{ fontWeight: 600 }}>42 Nodes</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.5 }}>
        <button className="glow-btn" onClick={() => setInteractions(generateMockData(20))}>
          Regenerate Simulation Data
        </button>
      </div>
    </div>
  );
};

export default App;
