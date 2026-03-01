import { useRef, useCallback } from 'react';
import * as THREE from 'three';

export interface VehicleData {
  id: string;
  position: THREE.Vector3;
  width: number;
  height: number;
  depth: number;
}

export function useCollisionDetection() {
  const lastCollisionTime = useRef<Record<string, number>>({});
  const COLLISION_COOLDOWN = 1500; // ms

  const checkCollisions = useCallback(
    (
      bikePosition: THREE.Vector3,
      vehicles: VehicleData[]
    ): string[] => {
      const now = Date.now();
      const collisions: string[] = [];

      const bikeHalfW = 0.4;
      const bikeHalfH = 0.8;
      const bikeHalfD = 1.0;

      for (const vehicle of vehicles) {
        const lastTime = lastCollisionTime.current[vehicle.id] || 0;
        if (now - lastTime < COLLISION_COOLDOWN) continue;

        const dx = Math.abs(bikePosition.x - vehicle.position.x);
        const dy = Math.abs(bikePosition.y - vehicle.position.y);
        const dz = Math.abs(bikePosition.z - vehicle.position.z);

        const overlapX = dx < bikeHalfW + vehicle.width / 2;
        const overlapY = dy < bikeHalfH + vehicle.height / 2;
        const overlapZ = dz < bikeHalfD + vehicle.depth / 2;

        if (overlapX && overlapY && overlapZ) {
          collisions.push(vehicle.id);
          lastCollisionTime.current[vehicle.id] = now;
        }
      }

      return collisions;
    },
    []
  );

  return { checkCollisions };
}
