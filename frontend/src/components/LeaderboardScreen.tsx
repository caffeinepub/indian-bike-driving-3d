import { useLeaderboard } from '../hooks/useQueries';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const { data: leaderboard, isLoading, isError, refetch } = useLeaderboard();

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/assets/generated/bike-select-bg.dim_1920x1080.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/65" />

      {/* Mandala top */}
      <div
        className="absolute top-0 left-0 right-0 h-16 opacity-40"
        style={{
          backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat-x',
        }}
      />

      <div className="relative z-10 w-full max-w-lg px-4 py-6 flex flex-col items-center gap-5">
        {/* Title */}
        <div className="text-center">
          <div className="text-5xl mb-1">🏆</div>
          <h1 className="text-4xl font-game text-saffron-400 text-shadow-saffron">Leaderboard</h1>
          <p className="text-cream-300 font-body text-sm mt-1">Top 10 Riders of India</p>
        </div>

        {/* Table */}
        <div
          className="game-panel rounded-2xl w-full overflow-hidden"
          style={{
            backgroundImage: `url('/assets/generated/mandala-border.dim_256x256.png')`,
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'overlay',
          }}
        >
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b border-saffron-500/30">
            <div className="w-10 text-xs text-saffron-300 font-body uppercase tracking-widest">#</div>
            <div className="flex-1 text-xs text-saffron-300 font-body uppercase tracking-widest">Rider</div>
            <div className="text-xs text-saffron-300 font-body uppercase tracking-widest">Score</div>
          </div>

          {isLoading && (
            <div className="py-10 text-center">
              <div className="text-3xl animate-spin-slow inline-block">🏵️</div>
              <p className="text-white/60 font-body text-sm mt-2">Loading scores...</p>
            </div>
          )}

          {isError && (
            <div className="py-8 text-center">
              <p className="text-red-400 font-body text-sm">Failed to load leaderboard</p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-saffron-400 text-xs font-body underline"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && (!leaderboard || leaderboard.length === 0) && (
            <div className="py-10 text-center">
              <div className="text-4xl mb-2">🏍️</div>
              <p className="text-white/60 font-body text-sm">No scores yet. Be the first!</p>
            </div>
          )}

          {leaderboard && leaderboard.length > 0 && (
            <div>
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center px-4 py-3 border-b border-white/5 transition-colors ${
                    index === 0 ? 'bg-saffron-500/10' : index === 1 ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="w-10 text-lg">
                    {index < 3 ? RANK_MEDALS[index] : <span className="text-white/50 font-body text-sm">{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-body font-semibold text-sm">{entry.nickname}</span>
                  </div>
                  <div className="text-saffron-400 font-game text-lg">
                    {Number(entry.score).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="btn-saffron px-10 py-3.5 rounded-2xl text-lg"
        >
          ← Back
        </button>
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
