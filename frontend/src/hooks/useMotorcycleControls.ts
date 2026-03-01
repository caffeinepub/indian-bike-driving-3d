import { useEffect, useRef } from 'react';

export interface ControlState {
  accelerate: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
}

const defaultControls: ControlState = {
  accelerate: false,
  brake: false,
  left: false,
  right: false,
};

// Shared mutable ref for controls (avoids re-renders)
let sharedControls: ControlState = { ...defaultControls };

export function getControls(): ControlState {
  return sharedControls;
}

export function setControl(key: keyof ControlState, value: boolean) {
  sharedControls = { ...sharedControls, [key]: value };
}

export function resetControls() {
  sharedControls = { ...defaultControls };
}

export function useMotorcycleControls() {
  const controlsRef = useRef<ControlState>({ ...defaultControls });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          sharedControls.accelerate = true;
          controlsRef.current.accelerate = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          sharedControls.brake = true;
          controlsRef.current.brake = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          sharedControls.left = true;
          controlsRef.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          sharedControls.right = true;
          controlsRef.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          sharedControls.accelerate = false;
          controlsRef.current.accelerate = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          sharedControls.brake = false;
          controlsRef.current.brake = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          sharedControls.left = false;
          controlsRef.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          sharedControls.right = false;
          controlsRef.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resetControls();
    };
  }, []);

  return controlsRef;
}
