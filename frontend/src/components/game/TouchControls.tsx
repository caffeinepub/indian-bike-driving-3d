import { useEffect, useRef } from 'react';
import { setControl } from '../../hooks/useMotorcycleControls';

export default function TouchControls() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const handleTouchStart = (control: 'accelerate' | 'brake' | 'left' | 'right') => {
    setControl(control, true);
  };

  const handleTouchEnd = (control: 'accelerate' | 'brake' | 'left' | 'right') => {
    setControl(control, false);
  };

  if (!isTouchDevice) return null;

  const btnBase =
    'select-none active:scale-95 transition-transform flex items-center justify-center rounded-xl text-white font-game font-bold text-xl shadow-lg';
  const btnSaffron = `${btnBase} bg-saffron-500/80 border-2 border-saffron-300/50 backdrop-blur-sm`;
  const btnTerra = `${btnBase} bg-terracotta-600/80 border-2 border-terracotta-400/50 backdrop-blur-sm`;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Left side - steer */}
      <div className="absolute bottom-8 left-4 flex gap-3 pointer-events-auto">
        <button
          className={`${btnSaffron} w-16 h-16`}
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onTouchCancel={() => handleTouchEnd('left')}
        >
          ◀
        </button>
        <button
          className={`${btnSaffron} w-16 h-16`}
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onTouchCancel={() => handleTouchEnd('right')}
        >
          ▶
        </button>
      </div>

      {/* Right side - accelerate/brake */}
      <div className="absolute bottom-8 right-4 flex flex-col gap-3 pointer-events-auto">
        <button
          className={`${btnSaffron} w-16 h-16`}
          onTouchStart={() => handleTouchStart('accelerate')}
          onTouchEnd={() => handleTouchEnd('accelerate')}
          onTouchCancel={() => handleTouchEnd('accelerate')}
        >
          ▲
        </button>
        <button
          className={`${btnTerra} w-16 h-16`}
          onTouchStart={() => handleTouchStart('brake')}
          onTouchEnd={() => handleTouchEnd('brake')}
          onTouchCancel={() => handleTouchEnd('brake')}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
