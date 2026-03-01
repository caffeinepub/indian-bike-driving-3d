import { useState, useCallback, useRef } from 'react';

export type GameStatus = 'menu' | 'selecting' | 'playing' | 'gameover' | 'leaderboard';

export interface GameState {
  status: GameStatus;
  speed: number;
  distance: number;
  score: number;
  health: number;
  maxHealth: number;
}

const initialState: GameState = {
  status: 'menu',
  speed: 0,
  distance: 0,
  score: 0,
  health: 5,
  maxHealth: 5,
};

export function useGameState() {
  const [state, setState] = useState<GameState>({ ...initialState });
  const stateRef = useRef<GameState>({ ...initialState });

  const updateState = useCallback((updates: Partial<GameState>) => {
    stateRef.current = { ...stateRef.current, ...updates };
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setStatus = useCallback((status: GameStatus) => {
    updateState({ status });
  }, [updateState]);

  const updateGameValues = useCallback((speed: number, distance: number, score: number) => {
    stateRef.current.speed = speed;
    stateRef.current.distance = distance;
    stateRef.current.score = score;
    setState(prev => ({ ...prev, speed, distance, score }));
  }, []);

  const decrementHealth = useCallback(() => {
    const newHealth = Math.max(0, stateRef.current.health - 1);
    stateRef.current.health = newHealth;
    setState(prev => {
      const updated = { ...prev, health: newHealth };
      if (newHealth <= 0) {
        updated.status = 'gameover';
        stateRef.current.status = 'gameover';
      }
      return updated;
    });
    return newHealth;
  }, []);

  const resetGame = useCallback(() => {
    const reset = { ...initialState, status: 'playing' as GameStatus };
    stateRef.current = { ...reset };
    setState({ ...reset });
  }, []);

  return {
    state,
    stateRef,
    setStatus,
    updateGameValues,
    decrementHealth,
    resetGame,
  };
}
