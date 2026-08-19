import React from 'react';
import bgImage from '../assets/images/eco_website_bg_1787062661277.jpg';

export const GlobalBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      id="global-environmental-background"
    >
      {/* Primary Cinematic Environmental Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 transform-gpu"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Atmospheric Mist & Readability Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/20 to-slate-950/65 backdrop-blur-[0.5px]" />

      {/* Soft Emerald & Teal Ambient Radial Lights */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-teal-400/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[600px] bg-emerald-600/15 rounded-full blur-3xl animate-pulse-glow" />

      {/* Subtle Environmental Glass Ecosystem Circles (Decorative 3D Depth) */}
      <div className="absolute top-20 right-12 w-72 h-72 rounded-full border border-white/10 bg-white/[0.02] blur-xs animate-spin-veryslow" />
      <div className="absolute bottom-24 left-10 w-96 h-96 rounded-full border border-emerald-400/10 bg-emerald-500/[0.01] animate-float-reverse" />

      {/* Floating Micro Particles (Subtle Bio-luminescence) */}
      <div className="absolute top-1/4 left-1/5 w-2 h-2 rounded-full bg-emerald-300/40 blur-[1px] animate-float-slow" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-teal-200/50 blur-[1px] animate-float-reverse" />
      <div className="absolute top-2/3 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-400/30 blur-[1px] animate-float-slow" />
      <div className="absolute top-1/2 right-1/6 w-1.5 h-1.5 rounded-full bg-white/40 blur-[1px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/6 w-2 h-2 rounded-full bg-emerald-300/35 blur-[1px] animate-float-reverse" />
      
      {/* Floating Leaf Particles */}
      <div
        className="absolute top-20 left-[15%] text-emerald-300/20 text-xl animate-leaf-drift"
        style={{ animationDuration: '14s', animationDelay: '0s' }}
      >
        🍃
      </div>
      <div
        className="absolute top-1/2 right-[12%] text-emerald-200/20 text-lg animate-leaf-drift"
        style={{ animationDuration: '18s', animationDelay: '4s' }}
      >
        🌿
      </div>
      <div
        className="absolute bottom-1/3 left-[28%] text-teal-300/15 text-sm animate-leaf-drift"
        style={{ animationDuration: '16s', animationDelay: '8s' }}
      >
        🌱
      </div>
    </div>
  );
};
