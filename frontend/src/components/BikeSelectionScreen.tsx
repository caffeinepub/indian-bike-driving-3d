import { useState } from 'react';
import { bikes } from '../data/bikes';
import { BikeOption } from '../types/bike';

interface BikeSelectionScreenProps {
  onSelectBike: (bike: BikeOption) => void;
  onShowLeaderboard: () => void;
}

function StatBar({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 flex-1 rounded-sm transition-all duration-300"
          style={{
            backgroundColor: i < value ? color : 'rgba(255,255,255,0.15)',
            boxShadow: i < value ? `0 0 4px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function BikeSelectionScreen({ onSelectBike, onShowLeaderboard }: BikeSelectionScreenProps) {
  const [selected, setSelected] = useState<string>(bikes[0].id);
  const selectedBike = bikes.find((b) => b.id === selected) || bikes[0];

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/assets/generated/bike-select-bg.dim_1920x1080.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Mandala decorative top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 opacity-30"
        style={{
          backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl px-4 py-6 flex flex-col items-center gap-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-game text-saffron-400 text-shadow-saffron leading-tight">
            🏍️ Indian Bike
          </h1>
          <h2 className="text-3xl md:text-4xl font-game text-cream-200 text-shadow-dark">
            Driving 3D
          </h2>
          <p className="text-terracotta-300 font-body text-lg mt-1 tracking-wide">
            Choose your ride and hit the road!
          </p>
        </div>

        {/* Bike cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {bikes.map((bike) => (
            <button
              key={bike.id}
              onClick={() => setSelected(bike.id)}
              className={`relative rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer border-2 ${
                selected === bike.id
                  ? 'border-saffron-400 scale-105 shadow-saffron-lg'
                  : 'border-white/20 hover:border-saffron-500/60 hover:scale-102'
              }`}
              style={{
                background:
                  selected === bike.id
                    ? 'linear-gradient(135deg, rgba(60, 25, 5, 0.95), rgba(100, 40, 5, 0.9))'
                    : 'linear-gradient(135deg, rgba(20, 10, 5, 0.85), rgba(40, 20, 5, 0.8))',
                backdropFilter: 'blur(12px)',
              }}
            >
              {selected === bike.id && (
                <div className="absolute top-2 right-2 bg-saffron-500 text-white text-xs font-game px-2 py-0.5 rounded-full">
                  SELECTED
                </div>
              )}

              {/* Bike image */}
              <div className="w-full h-32 flex items-center justify-center mb-3 rounded-xl overflow-hidden bg-black/30">
                <img
                  src={bike.imagePath}
                  alt={bike.name}
                  className="h-full w-full object-contain p-2"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(255,153,51,0.4))' }}
                />
              </div>

              {/* Bike name */}
              <h3 className="text-xl font-game text-saffron-300 mb-0.5">{bike.name}</h3>
              <p className="text-xs text-white/60 font-body mb-3">{bike.description}</p>

              {/* Stats */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-white/70 font-body mb-1">
                    <span>Speed</span>
                    <span>{bike.speed}/10</span>
                  </div>
                  <StatBar value={bike.speed} color="#ff9933" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/70 font-body mb-1">
                    <span>Handling</span>
                    <span>{bike.handling}/10</span>
                  </div>
                  <StatBar value={bike.handling} color="#22c55e" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/70 font-body mb-1">
                    <span>Acceleration</span>
                    <span>{bike.acceleration}/10</span>
                  </div>
                  <StatBar value={bike.acceleration} color="#3b82f6" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => onSelectBike(selectedBike)}
            className="btn-saffron px-10 py-4 rounded-2xl text-xl shadow-saffron-lg"
          >
            🚀 Start Riding!
          </button>
          <button
            onClick={onShowLeaderboard}
            className="px-8 py-4 rounded-2xl text-lg font-game text-cream-200 border-2 border-cream-400/40 hover:border-cream-300/70 transition-all"
            style={{ background: 'rgba(20, 10, 5, 0.7)', backdropFilter: 'blur(8px)' }}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* Mandala decorative bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 opacity-30"
        style={{
          backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      {/* Footer */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-white/30 text-xs font-body z-10">
        © {new Date().getFullYear()} Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'indian-bike-driving-3d')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron-400 hover:text-saffron-300 transition-colors"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
