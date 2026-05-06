export interface ModuleEntry {
  title: string;
  subtitle: string;
  description: string;
  need: string;
  skills: string[];
  icon: string;
  video?: string;
  externalLink?: string;
  brief: string;
  computeLayer: string;
  latency: string;
  throughput: string;
}

export const moduleData: Record<string, ModuleEntry> = {
  "generative-ai": {
    title: "Generative AI",
    subtitle: "Architecture & Core Mechanics",
    description: "Generative AI represents a fundamental shift from retrieval-based systems to probabilistic synthesis. This module provides a rigorous teardown of the Transformer architecture—the engine behind modern LLMs. We move beyond simple prompting to analyze self-attention mechanisms, positional encoding, and the high-dimensional latent spaces where semantic meaning is mapped. You will gain a diagnostic understanding of how models predict token sequences, the mathematical origins of stochastic hallucinations, and the engineering required to steer model behavior through precise context window management and architectural constraints. This is the transition from being a prompt user to becoming an AI architect who can predict and control model outputs with surgical precision.",
    need: "For the professional engineer or strategist, surface-level tool usage is a liability. Comprehensive knowledge of the underlying GPT (Generative Pre-trained Transformer) mechanics is the only way to architect secure, reliable, and scalable enterprise systems that don't fail in edge cases.",
    skills: ["Transformer Mechanics", "Tokenization Logic", "Privacy & Safety Frameworks", "Bias Mitigation"],
    icon: "⚡",
    video: "/AILeads/videos/genai_v2.mp4",
    externalLink: "https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/overview",
    brief: "Analyzes the Transformer backbone, self-attention layers, and tokenization pipelines. Focuses on latent space mapping and stochastic prediction accuracy.",
    computeLayer: "A100 Tensor Core Grid",
    latency: "28ms",
    throughput: "1.2k"
  },
  "agentic-ai": {
    title: "Agentic AI",
    subtitle: "Autonomous Agents & Multi-Step Workflows",
    description: "Transition from single queries to delegated workflows. You will design 'Agentic' systems that can plan, reason, and operate over multiple steps. By the end of this module, you will have configured specialized AI collaborators trained on your specific voice, data, and daily operational needs.",
    need: "Single-turn prompts are the past; autonomous execution is the future. Learning to build agents that solve problems independently is the difference between having a tool and having a digital workforce.",
    skills: ["Process Decomposition", "Memory Management", "Goal Orientation", "Tool Integration"],
    icon: "🤖",
    video: "/AILeads/videos/agentic.mp4",
    externalLink: "https://cloud.google.com/discover/what-is-agentic-ai",
    brief: "Monitors the recursive reasoning loop (Chain-of-Thought) and tool-calling execution. Optimizes for decision-making accuracy and autonomous goal attainment.",
    computeLayer: "H100 Distributed Cluster",
    latency: "42ms",
    throughput: "0.8k"
  },
  "vibe-coding": {
    title: "Vibe Coding",
    subtitle: "Intuitive Software Composition",
    description: "Move beyond syntax and logic into the era of natural language software creation. Vibe Coding focuses on intent-based development where the 'vibe' or vision of the product drives the generation process. Learn to steer AI to build complex applications through iterative conversation and aesthetic guidance.",
    need: "The barrier to entry for software creation has collapsed. Professionals who can 'vibe' their way through complex codebases using high-level intent will outperform traditional developers in speed and innovation.",
    skills: ["Intuitive Logic", "Rapid Prototyping", "Natural Language Architecture", "Iterative Refinement"],
    icon: "🌊",
    video: "/AILeads/videos/vibecoding.mp4",
    externalLink: "https://developers.openai.com/api/docs",
    brief: "Tracks the translation of natural language intent into executable syntax. Optimized for rapid code synthesis and structural integrity across complex file systems.",
    computeLayer: "L40S GPU Inference Node",
    latency: "12ms",
    throughput: "3.5k"
  },
  "visual-storytelling": {
    title: "Visual Storytelling",
    subtitle: "Multimodal Synthesis & Content Creation",
    description: "Master the art of directing powerful visual AI models and generative video. Learn the syntax required for exact artistic control, storyboard generation, and creating pixel-perfect multimodal assets that elevate your presentations, products, and marketing material with cinematic quality.",
    need: "High-fidelity visual content is no longer a luxury. Being able to manifest your ideas visually in seconds allows you to communicate complex visions and market products with unprecedented speed and impact.",
    skills: ["DALL-E & Midjourney Mastery", "Video Synthesis", "Style Consistency", "Directorial Prompting"],
    icon: "🎨",
    video: "/AILeads/videos/visual_storytelling.mp4",
    externalLink: "https://deepmind.google/research",
    brief: "Visualizes the multi-step diffusion process and temporal consistency. Maps prompt semantic weights to high-resolution pixel generation and cinematic frame synthesis.",
    computeLayer: "RTX 6000 Ada Cluster",
    latency: "120ms",
    throughput: "0.2k"
  }
};
