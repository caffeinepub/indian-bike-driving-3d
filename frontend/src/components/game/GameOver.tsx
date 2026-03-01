import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitScore } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface GameOverProps {
  score: number;
  distance: number;
  onRestart: () => void;
  onMenu: () => void;
  onShowLeaderboard: () => void;
}

export default function GameOver({ score, distance, onRestart, onMenu, onShowLeaderboard }: GameOverProps) {
  const [nickname, setNickname] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { identity, login, loginStatus } = useInternetIdentity();
  const { mutate: submitScore, isPending, isError, isSuccess } = useSubmitScore();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const handleSubmit = () => {
    if (!nickname.trim() || !isAuthenticated) return;
    submitScore(
      { nickname: nickname.trim(), score },
      {
        onSuccess: () => {
          setSubmitted(true);
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
        },
      }
    );
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-40"
      style={{
        backgroundImage: `url('/assets/generated/gameover-bg.dim_1920x1080.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      {/* Mandala top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 opacity-40"
        style={{
          backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center gap-5">
        {/* Game Over title */}
        <div className="text-center">
          <div className="text-6xl mb-2">💥</div>
          <h1 className="text-5xl font-game text-saffron-400 text-shadow-saffron">GAME OVER</h1>
          <p className="text-cream-300 font-body text-lg mt-1">Better luck next time, rider!</p>
        </div>

        {/* Stats */}
        <div
          className="game-panel rounded-2xl p-5 w-full text-center"
          style={{
            backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">Final Score</div>
              <div className="text-4xl font-game text-saffron-400 text-shadow-saffron">
                {Math.floor(score).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">Distance</div>
              <div className="text-4xl font-game text-cream-300">
                {(distance / 1000).toFixed(2)} km
              </div>
            </div>
          </div>
        </div>

        {/* Score submission */}
        <div className="game-panel rounded-2xl p-4 w-full">
          <h3 className="text-lg font-game text-saffron-300 mb-3 text-center">Submit Your Score</h3>

          {!isAuthenticated ? (
            <div className="text-center">
              <p className="text-white/70 font-body text-sm mb-3">Login to save your score to the leaderboard</p>
              <button
                onClick={handleLogin}
                disabled={loginStatus === 'logging-in'}
                className="btn-saffron px-6 py-2.5 rounded-xl text-sm w-full"
              >
                {loginStatus === 'logging-in' ? '⏳ Logging in...' : '🔐 Login to Submit'}
              </button>
            </div>
          ) : submitted || isSuccess ? (
            <div className="text-center py-2">
              <div className="text-3xl mb-1">🎉</div>
              <p className="text-green-400 font-game text-lg">Score Submitted!</p>
              <p className="text-white/60 font-body text-sm">Check the leaderboard!</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.slice(0, 20))}
                placeholder="Your nickname..."
                maxLength={20}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white font-body placeholder-white/40 focus:outline-none focus:border-saffron-400 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={!nickname.trim() || isPending}
                className="btn-saffron px-4 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? '⏳' : '✓ Submit'}
              </button>
            </div>
          )}

          {isError && (
            <p className="text-red-400 text-xs font-body mt-2 text-center">Failed to submit. Try again.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap justify-center w-full">
          <button
            onClick={onRestart}
            className="btn-saffron px-8 py-3.5 rounded-2xl text-lg flex-1 min-w-[140px]"
          >
            🔄 Restart
          </button>
          <button
            onClick={onShowLeaderboard}
            className="px-6 py-3.5 rounded-2xl text-base font-game text-cream-200 border-2 border-cream-400/40 hover:border-cream-300/70 transition-all flex-1 min-w-[140px]"
            style={{ background: 'rgba(20, 10, 5, 0.7)' }}
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={onMenu}
            className="px-6 py-3.5 rounded-2xl text-base font-game text-white/70 border-2 border-white/20 hover:border-white/40 transition-all flex-1 min-w-[140px]"
            style={{ background: 'rgba(20, 10, 5, 0.7)' }}
          >
            🏠 Menu
          </button>
        </div>
      </div>

      {/* Mandala bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 opacity-40"
        style={{
          backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat-x',
        }}
      />
    </div>
  );
}
