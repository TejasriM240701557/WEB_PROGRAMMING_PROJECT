import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Send,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Bot,
  User,
  Clock,
  Layers,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatCompactINR } from '../utils/formatters';
import { Button } from '../components/ui/Button';

const SUGGESTED_PROMPTS = [
  'Why did our operating profit change this billing cycle?',
  'Can we afford to hire 5 more senior engineers right now?',
  'What happens if enterprise revenue decreases by 15%?',
  'Which department cost center has the highest budget variance?',
  'How much liquid cash should we retain for statutory runway?',
  'Compare investing in marketing expansion vs private GPU compute cluster.',
];

export const FinancialAdvisor = () => {
  const { askAIAdvisor, metrics, activeCompany } = useFinance();
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      timestamp: 'Just now',
      response: askAIAdvisor('financial health summary'),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSendQuery = (textToSend) => {
    const query = textToSend || queryInput;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setQueryInput('');
    setIsThinking(true);

    setTimeout(() => {
      const aiResponse = askAIAdvisor(query);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: 'Just now',
        response: aiResponse,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-neon-cyan" size={24} />
            NexusCapFIN Corporate AI Financial Strategist
          </h2>
          <p className="text-xs text-[#939BB2] mt-0.5">
            Deterministic decision-support engine grounded in verified ledger metrics and GAAP accounting rules
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-neon-mint bg-[#121624] px-3 py-1.5 rounded-xl border border-white/5 self-start sm:self-auto">
          <ShieldCheck size={14} />
          <span>Zero Hallucination Guarantee</span>
        </div>
      </div>

      {/* Suggested Executive Prompts Carousel */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block">
          Strategic Prompts for Executive Management:
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendQuery(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#121624] hover:bg-[#191E30] text-[#939BB2] hover:text-white border border-white/5 hover:border-white/20 transition-all text-left flex items-center gap-1.5"
            >
              <Lightbulb size={12} className="text-neon-cyan shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4 min-h-[420px] max-h-[600px] overflow-y-auto pr-1">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-xl p-3.5 rounded-2xl bg-gradient-to-r from-neon-violet/20 to-neon-cyan/20 border border-neon-violet/30 text-white text-xs leading-relaxed font-medium shadow-card-depth">
                  {msg.text}
                </div>
              </div>
            );
          }

          const resp = msg.response;
          return (
            <div key={msg.id} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet p-[1px] shrink-0 mt-1 shadow-glow-cyan/20">
                <div className="w-full h-full bg-[#08090F] rounded-[11px] flex items-center justify-center text-neon-cyan">
                  <Bot size={16} />
                </div>
              </div>

              {/* AI Structured Analytical Response Card */}
              <div className="flex-1 p-5 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      {resp.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neon-cyan">
                      Period: {resp.period}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neon-mint bg-neon-mint/10 border border-neon-mint/30 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    {resp.confidence}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-white leading-relaxed font-medium">
                  {resp.summary}
                </p>

                {/* Key Quantitative Findings */}
                <div className="p-3.5 rounded-xl bg-[#0E1018] border border-white/5 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#939BB2] block">
                    Authoritative Financial Evidence:
                  </span>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {resp.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neon-cyan font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Methodology & Impact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#191E30]/70 border border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#939BB2] block mb-1">
                      Estimated Financial Impact
                    </span>
                    <p className="text-[#F5F7FF] leading-relaxed text-[11px]">
                      {resp.impact}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#191E30]/70 border border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 block mb-1">
                      Identified Strategic Risks
                    </span>
                    <p className="text-[#939BB2] leading-relaxed text-[11px]">
                      {resp.risks}
                    </p>
                  </div>
                </div>

                {/* Actionable Next Steps */}
                <div className="p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles size={14} className="text-neon-cyan shrink-0" />
                    <span>
                      <strong className="text-neon-cyan">Recommended Next Step:</strong> {resp.nextSteps}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 items-center text-xs text-[#939BB2] font-mono">
            <Bot size={16} className="text-neon-cyan animate-pulse" />
            <span>Consulting deterministic financial engine & calculating ledger aggregates...</span>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <div className="p-2 rounded-2xl bg-[#121624] border border-white/10 shadow-card-depth flex items-center gap-2">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendQuery();
          }}
          placeholder="Ask a strategic corporate finance question (e.g. 'Can we afford a 8% salary increment?')..."
          className="flex-1 bg-transparent text-xs text-white placeholder-[#5A627B] px-3.5 py-2.5 outline-none"
        />
        <Button
          variant="neon"
          size="sm"
          icon={Send}
          onClick={() => handleSendQuery()}
          disabled={!queryInput.trim() || isThinking}
        >
          Analyze
        </Button>
      </div>
    </div>
  );
};
