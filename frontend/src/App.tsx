import { useState, useCallback } from 'react';
import { BikeOption } from './types/bike';
import { bikes } from './data/bikes';
import { useGameState } from './hooks/useGameState';
import BikeSelectionScreen from './components/BikeSelectionScreen';
import GameScene from './components/game/GameScene';
import GameOver from './components/game/GameOver';
import LeaderboardScreen from './components/LeaderboardScreen';

export default function App() {
  const [selectedBike, setSelectedBike] = useState<BikeOption>(bikes[0]);
  const {
    state,
    setStatus,
    updateGameValues,
    decrementHealth,
    resetGame,
  } = useGameState();

  const handleSelectBike = useCallback((bike: BikeOption) => {
    setSelectedBike(bike);
    setStatus('playing');
  }, [setStatus]);

  const handleCollision = useCallback(() => {
    decrementHealth();
  }, [decrementHealth]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleMenu = useCallback(() => {
    setStatus('selecting');
  }, [setStatus]);

  const handleShowLeaderboard = useCallback(() => {
    setStatus('leaderboard');
  }, [setStatus]);

  const handleBackFromLeaderboard = useCallback(() => {
    setStatus('selecting');
  }, [setStatus]);

  const handleGameValuesUpdate = useCallback(
    (speed: number, distance: number, score: number) => {
      updateGameValues(speed, distance, score);
    },
    [updateGameValues]
  );

  // Initial screen - show bike selection
  if (state.status === 'selecting' || state.status === 'menu') {
    return (
      <BikeSelectionScreen
        onSelectBike={handleSelectBike}
        onShowLeaderboard={handleShowLeaderboard}
      />
    );
  }

  if (state.status === 'leaderboard') {
    return <LeaderboardScreen onBack={handleBackFromLeaderboard} />;
  }

  return (
    <>
      {(state.status === 'playing' || state.status === 'gameover') && (
        <GameScene
          bike={selectedBike}
          score={state.score}
          speed={state.speed}
          distance={state.distance}
          health={state.health}
          maxHealth={state.maxHealth}
          isPlaying={state.status === 'playing'}
          onGameValuesUpdate={handleGameValuesUpdate}
          onCollision={handleCollision}
        />
      )}

      {state.status === 'gameover' && (
        <GameOver
          score={state.score}
          distance={state.distance}
          onRestart={handleRestart}
          onMenu={handleMenu}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
    </>
  );
}
