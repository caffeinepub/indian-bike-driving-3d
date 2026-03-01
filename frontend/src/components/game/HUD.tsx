interface HUDProps {
  speed: number;
  distance: number;
  score: number;
  health: number;
  maxHealth: number;
}

export default function HUD({ speed, distance, score, health, maxHealth }: HUDProps) {
  const healthPercent = (health / maxHealth) * 100;
  const healthColor =
    healthPercent > 60 ? '#22c55e' : healthPercent > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 gap-3">
        {/* Score */}
        <div
          className="game-panel rounded-lg px-4 py-2 min-w-[120px]"
          style={{
            backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
            backgroundSize: '30px 30px',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">Score</div>
          <div className="text-2xl font-game text-saffron-400 text-shadow-saffron leading-tight">
            {Math.floor(score).toLocaleString()}
          </div>
        </div>

        {/* Speed - center */}
        <div className="game-panel rounded-xl px-5 py-2 text-center">
          <div className="text-3xl font-game text-white text-shadow-dark leading-tight">
            {Math.floor(speed)}
          </div>
          <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">km/h</div>
        </div>

        {/* Distance */}
        <div className="game-panel rounded-lg px-4 py-2 min-w-[120px] text-right">
          <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">Distance</div>
          <div className="text-2xl font-game text-cream-300 leading-tight">
            {(distance / 1000).toFixed(2)} km
          </div>
        </div>
      </div>

      {/* Health bar - bottom left */}
      <div className="absolute bottom-4 left-4">
        <div className="game-panel rounded-lg px-3 py-2">
          <div className="text-xs text-saffron-300 font-body uppercase tracking-widest mb-1">Health</div>
          <div className="flex gap-1.5">
            {Array.from({ length: maxHealth }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-sm border border-white/20 transition-all duration-300"
                style={{
                  backgroundColor: i < health ? healthColor : 'rgba(255,255,255,0.1)',
                  boxShadow: i < health ? `0 0 6px ${healthColor}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls hint - bottom right */}
      <div className="absolute bottom-4 right-4">
        <div className="game-panel rounded-lg px-3 py-2 text-xs text-white/60 font-body">
          <div>W/↑ Accelerate</div>
          <div>S/↓ Brake</div>
          <div>A/← D/→ Steer</div>
        </div>
      </div>
    </div>
  );
}
