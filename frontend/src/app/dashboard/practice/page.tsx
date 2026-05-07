"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle, 
  Volume2, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Puzzle, 
  Target, 
  Award, 
  ArrowRight, 
  Activity, 
  Play,
  HelpCircle,
  Clock,
  Check
} from "lucide-react";

// Native speech synthesis helper
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};

// Vocabulary / Flashcard terminology dataset
const aiTerms = [
  {
    id: "1",
    word: "Zero-Shot Prompting",
    meaning: "Providing a model with a task description without any prior training examples.",
    exampleSentence: "Ask an LLM: 'Translate the following English sentence to French: Hello world' without any other text.",
  },
  {
    id: "2",
    word: "Few-Shot Prompting",
    meaning: "Providing a model with a few high-quality input-output examples to guide its performance.",
    exampleSentence: "Give 3 examples of classifying movie reviews, then input the target review for classification.",
  },
  {
    id: "3",
    word: "Chain of Thought (CoT)",
    meaning: "Enabling complex reasoning by instructing the model to break tasks into intermediate steps.",
    exampleSentence: "Adding 'Let's think step-by-step' to a prompt to solve a multi-step math problem.",
  },
  {
    id: "4",
    word: "RAG",
    meaning: "Retrieval-Augmented Generation: Enhancing LLM outputs by retrieving relevant facts from external vector databases.",
    exampleSentence: "A customer service bot querying the company's internal PDFs before formulating a response.",
  },
  {
    id: "5",
    word: "RLHF",
    meaning: "Reinforcement Learning from Human Feedback: Aligning AI outputs with human preferences using reward models.",
    exampleSentence: "Using human-written ratings to train ChatGPT to be helpful, harmless, and honest.",
  },
  {
    id: "6",
    word: "System Prompt",
    meaning: "A foundational set of instructions defining the AI's core identity, constraints, tone, and behavioral rules.",
    exampleSentence: "'You are an expert financial consultant. Keep responses concise and always cite sources.'",
  },
  {
    id: "7",
    word: "Hallucination",
    meaning: "When an AI model generates factually incorrect, nonsensical, or ungrounded claims with high confidence.",
    exampleSentence: "An LLM citing a completely fabricated court case or non-existent URL during research.",
  },
  {
    id: "8",
    word: "Temperature",
    meaning: "A hyperparameter controlling the randomness, creativity, and diversity of a generative model's outputs.",
    exampleSentence: "Setting temperature to 0 for highly deterministic code generation, or 0.8 for creative writing.",
  }
];

// Quiz dataset
const quizQuestions = [
  {
    question: "Which prompting technique involves guiding the model's reasoning by breaking down complex tasks into sequential intermediate steps?",
    options: [
      "Zero-Shot Prompting",
      "Chain of Thought (CoT)",
      "Few-Shot Prompting",
      "Retrieval-Augmented Generation"
    ],
    answer: "Chain of Thought (CoT)",
    feedback: "Chain of Thought (CoT) prompting enables the model to solve complex reasoning problems by breaking them down into a step-by-step logical sequence."
  },
  {
    question: "What is the primary benefit of Retrieval-Augmented Generation (RAG) in enterprise AI applications?",
    options: [
      "It speeds up the model's training process",
      "It allows the model to generate creative fiction",
      "It grounds model responses in private, up-to-date domain data without expensive retraining",
      "It decreases the temperature of the model to exactly zero"
    ],
    answer: "It grounds model responses in private, up-to-date domain data without expensive retraining",
    feedback: "RAG connects your generative AI model to an external vector store, pulling in relevant domain files in real-time to provide accurate, fact-based answers."
  },
  {
    question: "If you want a model to output highly reliable, predictable, and exact responses (e.g., for JSON or code generation), what temperature should you set?",
    options: [
      "Temperature: 1.0 (Maximum creativity)",
      "Temperature: 0.0 (High determinism)",
      "Temperature: 0.5 (Balanced mix)",
      "Temperature: -0.5 (Negative creativity)"
    ],
    answer: "Temperature: 0.0 (High determinism)",
    feedback: "A lower temperature makes the model more deterministic and less random, ensuring reliable, standardized outputs."
  },
  {
    question: "Which component of an LLM prompt is used to define its overall persona, ethical constraints, and operating guidelines?",
    options: [
      "User Message",
      "System Prompt",
      "Few-Shot Examples",
      "Context Documents"
    ],
    answer: "System Prompt",
    feedback: "The System Prompt sets the boundaries, tone, identity, and behavior guidelines of the assistant before user inputs are processed."
  }
];

export default function PracticeLabPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState<"menu" | "flashcards" | "match" | "quiz">("menu");

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Match game state
  const [matchWords, setMatchWords] = useState<any[]>([]);
  const [matchMeanings, setMatchMeanings] = useState<any[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedWordNum, setSelectedWordNum] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [matchScore, setMatchScore] = useState(0);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizTimeSpent, setQuizTimeSpent] = useState(0);

  // Quiz timer
  useEffect(() => {
    if (activeMode === "quiz" && !quizComplete) {
      const interval = setInterval(() => {
        setQuizTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeMode, quizComplete]);

  // Initializing Match Game
  const startMatchGame = () => {
    // Pick 5 random terms
    const selected = [...aiTerms].sort(() => Math.random() - 0.5).slice(0, 5);
    setMatchWords(selected);
    // Shuffle meanings
    const meanings = selected.map(item => ({ wordId: item.id, meaning: item.meaning }))
      .sort(() => Math.random() - 0.5);
    setMatchMeanings(meanings);
    setMatchedPairs([]);
    setSelectedWordNum(null);
    setGameComplete(false);
    setMatchScore(0);
    setActiveMode("match");
  };

  // Initializing Quiz Game
  const startQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setShowFeedback(false);
    setQuizComplete(false);
    setQuizTimeSpent(0);
    setQuizStartTime(Date.now());
    setActiveMode("quiz");
  };

  // Match Game Input handler
  const handleMatchInput = (inputNum: number, correctWordId: string, itemMeaning: string) => {
    const wordItem = matchWords[inputNum - 1];
    if (wordItem && wordItem.id === correctWordId) {
      // Correct Match!
      if (!matchedPairs.includes(correctWordId)) {
        const updated = [...matchedPairs, correctWordId];
        setMatchedPairs(updated);
        setMatchScore(prev => prev + 20);
        if (updated.length === matchWords.length) {
          setGameComplete(true);
        }
      }
    }
  };

  // Quiz submit handler
  const submitQuizAnswer = () => {
    if (!selectedOption) return;
    const currentQ = quizQuestions[currentQuizIndex];
    if (selectedOption === currentQ.answer) {
      setQuizScore(prev => prev + 1);
    }
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setQuizComplete(true);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col">
      <DashboardSidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      
      <motion.div 
        animate={{ paddingLeft: isSidebarCollapsed ? "80px" : "280px" }}
        className="relative z-10 w-full flex-1 flex flex-col h-screen overflow-hidden"
      >
        <DashboardHeader />
        
        {/* Main Workspace Frame */}
        <main className="flex-1 p-6 flex flex-col items-center h-[calc(100vh-70px)] overflow-hidden min-h-0">
          <div className="w-full max-w-5xl h-full flex flex-col min-h-0">
            
            {/* Header Section */}
            <header className="mb-4 text-center shrink-0">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">LMS Practice Lab</h1>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-0.5">Interactive games, terminology cards, and knowledge quizzes</p>
            </header>

            {/* Main Interactive Screen with internal animations */}
            <div className="flex-1 min-h-0 bg-white/[0.01] border border-white/10 p-6 flex flex-col justify-center relative overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* 1. SELECT PRACTICE MODE (MENU) */}
                {activeMode === "menu" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -15 }}
                    key="mode-menu"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
                  >
                    {/* Mode Card 1: Flashcards */}
                    <div 
                      onClick={() => { setCurrentCardIndex(0); setIsFlipped(false); setActiveMode("flashcards"); }}
                      className="border border-white/10 bg-white/5 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#B8EF43]/50 transition-all aspect-square"
                    >
                      <div className="p-3 bg-white/5 border border-white/10 w-fit text-[#B8EF43]">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight italic group-hover:text-[#B8EF43] transition-colors mb-2">AI Concept Cards</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Flashcard learning with native audio pronunciation</p>
                      </div>
                    </div>

                    {/* Mode Card 2: Match Game */}
                    <div 
                      onClick={startMatchGame}
                      className="border border-white/10 bg-white/5 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#B8EF43]/50 transition-all aspect-square"
                    >
                      <div className="p-3 bg-white/5 border border-white/10 w-fit text-[#B8EF43]">
                        <Puzzle size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight italic group-hover:text-[#B8EF43] transition-colors mb-2">Match Master Game</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Connect advanced AI terminologies with their definitions</p>
                      </div>
                    </div>

                    {/* Mode Card 3: Quiz */}
                    <div 
                      onClick={startQuiz}
                      className="border border-white/10 bg-white/5 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#B8EF43]/50 transition-all aspect-square"
                    >
                      <div className="p-3 bg-white/5 border border-white/10 w-fit text-[#B8EF43]">
                        <Target size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tight italic group-hover:text-[#B8EF43] transition-colors mb-2">Leadership Quiz</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Test your enterprise prompting and AI reasoning models</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. FLASHCARDS MODE */}
                {activeMode === "flashcards" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    key="mode-flashcards"
                    className="w-full max-w-2xl mx-auto flex flex-col justify-between h-full py-4"
                  >
                    {/* Top Navigation Row */}
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <button onClick={() => setActiveMode("menu")} className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest border border-white/10 px-3 py-1.5 bg-white/5">
                        Back to Menu
                      </button>
                      <span className="text-xs font-black uppercase tracking-widest text-white/40">
                        Card {currentCardIndex + 1} of {aiTerms.length}
                      </span>
                    </div>

                    {/* Card container with perspective */}
                    <div 
                      className="flex-1 flex items-center justify-center min-h-0 py-4"
                      style={{ perspective: 1000 }}
                    >
                      <motion.div
                        onClick={() => setIsFlipped(!isFlipped)}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 220, damping: 20 }}
                        className="w-full max-w-md h-72 relative cursor-pointer"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* FRONT FACE */}
                        <div 
                          className="absolute inset-0 bg-[#111] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <span className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-4">Click to Reveal Definition</span>
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-[#B8EF43]">{aiTerms[currentCardIndex].word}</h2>
                            <button 
                              onClick={(e) => { e.stopPropagation(); speak(aiTerms[currentCardIndex].word); }}
                              className="text-white/40 hover:text-[#B8EF43] transition-colors p-1"
                            >
                              <Volume2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div 
                          className="absolute inset-0 bg-[#111] border border-[#B8EF43]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center backface-hidden"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <span className="text-[8px] font-bold uppercase tracking-widest text-[#B8EF43] mb-4">Definition Overview</span>
                          <h3 className="text-base font-bold uppercase tracking-widest mb-3 pr-2">{aiTerms[currentCardIndex].meaning}</h3>
                          <p className="text-[10px] text-white/40 uppercase font-medium italic">"{aiTerms[currentCardIndex].exampleSentence}"</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Side navigation control row */}
                    <div className="flex justify-center gap-4 shrink-0 mt-6">
                      <button 
                        disabled={currentCardIndex === 0}
                        onClick={() => { setCurrentCardIndex(prev => prev - 1); setIsFlipped(false); }}
                        className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center disabled:opacity-20 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        disabled={currentCardIndex === aiTerms.length - 1}
                        onClick={() => { setCurrentCardIndex(prev => prev + 1); setIsFlipped(false); }}
                        className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center disabled:opacity-20 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. MATCH GAME MODE */}
                {activeMode === "match" && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    key="mode-match"
                    className="w-full h-full flex flex-col justify-between"
                  >
                    {/* Top Stats Row */}
                    <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setActiveMode("menu")} className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest border border-white/10 px-3 py-1.5 bg-white/5">
                          Back to Menu
                        </button>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">AI Concept Matcher</h2>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#B8EF43]">Score: {matchScore}</span>
                        <button onClick={startMatchGame} className="text-white/40 hover:text-white"><RotateCcw size={14} /></button>
                      </div>
                    </div>

                    {/* Completion Modal Cover */}
                    {gameComplete ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white/[0.02]">
                        <Trophy size={64} className="text-[#B8EF43] mb-4" />
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Congratulations!</h2>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-6">You matched all concepts perfectly with a final score of {matchScore}!</p>
                        <div className="flex gap-4">
                          <button onClick={startMatchGame} className="bg-[#B8EF43] text-black font-black text-[9px] uppercase tracking-widest px-6 py-3 hover:scale-[1.02] transition-all">Play Again</button>
                          <button onClick={() => setActiveMode("menu")} className="bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[9px] uppercase tracking-widest px-6 py-3 transition-all">Return to Menu</button>
                        </div>
                      </div>
                    ) : (
                      /* Gameplay Grid */
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-0 overflow-y-auto pr-2">
                        {/* Word Column */}
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-3 flex items-center gap-2"><Target size={14} /> Concepts</h3>
                          {matchWords.map((item, index) => {
                            const isMatched = matchedPairs.includes(item.id);
                            return (
                              <div 
                                key={item.id} 
                                className={`p-4 border transition-all flex items-center justify-between ${isMatched ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-white/5 text-white'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${isMatched ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/60 border border-white/10'}`}>{index + 1}</span>
                                  <span className="text-[11px] font-black uppercase tracking-widest">{item.word}</span>
                                </div>
                                {isMatched && <CheckCircle size={14} />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Meanings Column */}
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-3">Definitions</h3>
                          {matchMeanings.map((item, index) => {
                            const isMatched = matchedPairs.includes(item.wordId);
                            return (
                              <div 
                                key={index} 
                                className={`p-4 border transition-all flex items-center justify-between gap-4 ${isMatched ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-white/5 text-white'}`}
                              >
                                <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed flex-1">{item.meaning}</p>
                                {!isMatched ? (
                                  <input 
                                    type="number" 
                                    min="1" 
                                    max="5"
                                    placeholder="?" 
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      if (val >= 1 && val <= 5) {
                                        handleMatchInput(val, item.wordId, item.meaning);
                                      }
                                    }}
                                    className="w-12 bg-white/5 border border-white/10 p-2 text-center text-xs font-black focus:border-[#B8EF43]/50 outline-none"
                                  />
                                ) : (
                                  <span className="text-[9px] font-black bg-emerald-500 text-black px-2 py-1 uppercase">Matched</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. PRACTICE QUIZ MODE */}
                {activeMode === "quiz" && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    key="mode-quiz"
                    className="w-full h-full flex flex-col justify-between"
                  >
                    {/* Top Progress Bar row */}
                    <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => setActiveMode("menu")} className="text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest border border-white/10 px-3 py-1.5 bg-white/5">
                          Back to Menu
                        </button>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Question {currentQuizIndex + 1} of {quizQuestions.length}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[10px]">
                        <Clock size={12} />
                        <span>{quizTimeSpent}s</span>
                      </div>
                    </div>

                    {quizComplete ? (
                      /* Results Card */
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/[0.02]">
                        <Award size={64} className="text-[#B8EF43] mb-4" />
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Quiz Complete!</h2>
                        
                        <div className="grid grid-cols-2 gap-8 my-6 p-6 bg-white/5 border border-white/10 rounded-xl w-full max-w-sm">
                          <div>
                            <p className="text-2xl font-black text-[#B8EF43]">{quizScore}/{quizQuestions.length}</p>
                            <p className="text-[8px] text-white/40 uppercase font-bold mt-1">Score</p>
                          </div>
                          <div>
                            <p className="text-2xl font-black text-white">{quizTimeSpent}s</p>
                            <p className="text-[8px] text-white/40 uppercase font-bold mt-1">Total Time</p>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                          <button onClick={startQuiz} className="bg-[#B8EF43] text-black font-black text-[9px] uppercase tracking-widest px-6 py-3 hover:scale-[1.02] transition-all">Retry Quiz</button>
                          <button onClick={() => setActiveMode("menu")} className="bg-white/5 hover:bg-white/10 border border-white/10 font-black text-[9px] uppercase tracking-widest px-6 py-3 transition-all">Return to Menu</button>
                        </div>
                      </div>
                    ) : (
                      /* Question Panel */
                      <div className="flex-1 flex flex-col justify-between min-h-0">
                        <div className="space-y-6 overflow-y-auto pr-2 flex-1">
                          <h2 className="text-lg font-black italic uppercase tracking-tight leading-snug">{quizQuestions[currentQuizIndex].question}</h2>
                          
                          {/* Options stack */}
                          <div className="space-y-3">
                            {quizQuestions[currentQuizIndex].options.map((option) => {
                              const isSelected = selectedOption === option;
                              return (
                                <button 
                                  key={option}
                                  onClick={() => { if (!showFeedback) setSelectedOption(option); }}
                                  disabled={showFeedback}
                                  className={`w-full p-4 border text-left text-xs font-black uppercase tracking-widest transition-all ${isSelected ? 'border-[#B8EF43] bg-[#B8EF43]/5 text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'}`}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>

                          {/* Dynamic Feedback Box */}
                          {showFeedback && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} 
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 border ${selectedOption === quizQuestions[currentQuizIndex].answer ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-red-500/30 bg-red-500/5 text-red-400'}`}
                            >
                              <p className="text-[10px] font-black uppercase mb-1">
                                {selectedOption === quizQuestions[currentQuizIndex].answer ? 'Correct Answer!' : 'Incorrect Answer'}
                              </p>
                              <p className="text-[9px] font-medium leading-relaxed uppercase">{quizQuestions[currentQuizIndex].feedback}</p>
                            </motion.div>
                          )}
                        </div>

                        {/* Submit Button */}
                        {!showFeedback && (
                          <button 
                            disabled={!selectedOption}
                            onClick={submitQuizAnswer}
                            className="bg-[#B8EF43] text-black font-black text-[9px] uppercase tracking-widest px-6 py-4 w-full text-center hover:scale-[1.01] transition-all disabled:opacity-20 mt-6 shrink-0"
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </main>

      </motion.div>
    </div>
  );
}
