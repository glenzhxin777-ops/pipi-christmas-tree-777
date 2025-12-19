
import React, { useState } from 'react';
import { TreeMorphState } from '../types';
import { Sparkles, Music, VolumeX, Send, TreePine, Boxes } from 'lucide-react';

interface OverlayUIProps {
  state: TreeMorphState;
  onToggle: () => void;
  onAddWish: (text: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const OverlayUI: React.FC<OverlayUIProps> = ({ 
  state, 
  onToggle, 
  onAddWish,
  isMuted,
  onToggleMute
}) => {
  const [wishText, setWishText] = useState('');
  const [showWishInput, setShowWishInput] = useState(false);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (wishText.trim()) {
      onAddWish(wishText);
      setWishText('');
      setShowWishInput(false);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.6)]">
            PIPI <span className="text-[#ffb7c5]">CHRISTMAS</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 tracking-[0.3em] uppercase font-light">
            Sending you a Christmas Tree
          </p>
        </div>

        <button 
          onClick={onToggleMute}
          className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-md"
        >
          {isMuted ? <VolumeX size={20} className="text-slate-400" /> : <Music size={20} className="text-[#00f2ff]" />}
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto">
        <div className="flex items-center gap-4">
            <button 
                onClick={onToggle}
                className={`
                    px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition-all duration-700
                    ${state === TreeMorphState.TREE_SHAPE 
                        ? 'bg-gradient-to-r from-[#00f2ff] to-[#ffb7c5] text-slate-900 shadow-[0_0_40px_rgba(255,183,197,0.4)]' 
                        : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'}
                `}
            >
                {state === TreeMorphState.TREE_SHAPE ? <TreePine size={20} /> : <Boxes size={20} />}
                {state === TreeMorphState.TREE_SHAPE ? 'Return to Void' : 'Assemble Magic'}
            </button>

            <button 
                onClick={() => setShowWishInput(!showWishInput)}
                className="p-4 bg-white/5 border border-white/20 rounded-full text-[#ffb7c5] hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,183,197,0.1)]"
            >
                <Sparkles size={24} />
            </button>
        </div>

        {showWishInput && (
            <form 
                onSubmit={handleSubmitWish}
                className="w-full max-w-md bg-slate-950/90 border border-[#ffb7c5]/40 p-6 rounded-3xl backdrop-blur-2xl animate-in slide-in-from-bottom-6 fade-in duration-500"
            >
                <h3 className="text-[#ffb7c5] font-serif text-xl mb-4 text-center tracking-wider">Make a Holiday Wish</h3>
                <div className="relative">
                    <input 
                        type="text" 
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        placeholder="Cast your wish into the stars..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00f2ff]/60 transition-colors"
                        autoFocus
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-2 p-1.5 text-[#00f2ff] hover:scale-125 transition-transform"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-[0.2em] font-light">
                    Your wish will manifest as a glowing star
                </p>
            </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-end text-[10px] text-slate-500 uppercase tracking-[0.4em] font-light">
        <p>© 2025 PIPI Christmas Experience</p>
        <p>Signature Engine v2.5</p>
      </div>
    </div>
  );
};
