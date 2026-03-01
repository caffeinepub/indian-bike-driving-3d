import { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { BikeOption } from '../../types/bike';
import { useMotorcycleControls } from '../../hooks/useMotorcycleControls';
import { useCollisionDetection, VehicleData } from '../../hooks/useCollisionDetection';
import Road from './Road';
import Environment from './Environment';
import Motorcycle from './Motorcycle';
import Traffic from './Traffic';
import HUD from './HUD';
import ImpactFlash from './ImpactFlash';
import TouchControls from './TouchControls';

interface GameSceneProps {
  bike: BikeOption;
  score: number;
  speed: number;
  distance: number;
  health: number;
  maxHealth: number;
  isPlaying: boolean;
  onGameValuesUpdate: (speed: number, distance: number, score: number) => void;
  onCollision: () => void;
}

// Camera that follows the bike
function FollowCamera({ bikeXRef }: { bikeXRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 4, 8));

  useFrame(() => {
    const targetX = bikeXRef.current * 0.3;
    targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, targetX, 0.05);
    camera.position.lerp(new THREE.Vector3(targetPos.current.x, 4.5, 9), 0.08);
    camera.lookAt(bikeXRef.current * 0.5, 1, -5);
  });

  return null;
}

// Game logic component inside Canvas
function GameLogic({
  bike,
  speedRef,
  bikeXRef,
  bikePositionRef,
  vehiclesRef,
  isPlaying,
  onGameValuesUpdate,
  onCollision,
}: {
  bike: BikeOption;
  speedRef: React.MutableRefObject<number>;
  bikeXRef: React.MutableRefObject<number>;
  bikePositionRef: React.MutableRefObject<THREE.Vector3>;
  vehiclesRef: React.MutableRefObject<VehicleData[]>;
  isPlaying: boolean;
  onGameValuesUpdate: (speed: number, distance: number, score: number) => void;
  onCollision: () => void;
}) {
  const distanceRef = useRef(0);
  const scoreRef = useRef(0);
  const lastCollisionRef = useRef(0);
  const { checkCollisions } = useCollisionDetection();

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const speed = speedRef.current;
    const speedKmh = speed * 3.6;

    // Update distance and score
    distanceRef.current += speed * delta;
    scoreRef.current += speedKmh * delta * 0.5;

    // Check collisions
    const now = Date.now();
    if (now - lastCollisionRef.current > 1500) {
      const collisions = checkCollisions(bikePositionRef.current, vehiclesRef.current);
      if (collisions.length > 0) {
        lastCollisionRef.current = now;
        speedRef.current = Math.max(0, speedRef.current * 0.3);
        onCollision();
      }
    }

    onGameValuesUpdate(speedKmh, distanceRef.current, scoreRef.current);
  });

  return null;
}

export default function GameScene({
  bike,
  score,
  speed,
  distance,
  health,
  maxHealth,
  isPlaying,
  onGameValuesUpdate,
  onCollision,
}: GameSceneProps) {
  const speedRef = useRef(0);
  const bikeXRef = useRef(0);
  const bikePositionRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const vehiclesRef = useRef<VehicleData[]>([]);
  const [impactTrigger, setImpactTrigger] = useState(0);

  useMotorcycleControls();

  const handleCollision = useCallback(() => {
    setImpactTrigger((prev) => prev + 1);
    onCollision();
  }, [onCollision]);

  const handleVehiclesUpdate = useCallback((vehicles: VehicleData[]) => {
    vehiclesRef.current = vehicles;
  }, []);

  return (
    <div className="fixed inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 4.5, 9], fov: 65, near: 0.1, far: 500 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} color="#ffe8c0" />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1.8}
          color="#fff5e0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <hemisphereLight args={['#87ceeb', '#c8a96e', 0.4]} />

        {/* Sky */}
        <Sky
          distance={450000}
          sunPosition={[1, 0.3, -1]}
          inclination={0.5}
          azimuth={0.25}
          turbidity={8}
          rayleigh={2}
        />
        <Stars radius={200} depth={50} count={1000} factor={3} fade />

        {/* Ground plane far */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -100]} receiveShadow>
          <planeGeometry args={[200, 400]} />
          <meshLambertMaterial color="#c8a96e" />
        </mesh>

        {/* Road */}
        <Road speedRef={speedRef} bikeXRef={bikeXRef} />

        {/* Environment */}
        <Environment speedRef={speedRef} />

        {/* Motorcycle */}
        <Motorcycle
          bike={bike}
          speedRef={speedRef}
          bikeXRef={bikeXRef}
          bikePositionRef={bikePositionRef}
          isPlaying={isPlaying}
        />

        {/* Traffic */}
        <Traffic
          speedRef={speedRef}
          bikeXRef={bikeXRef}
          score={score}
          onVehiclesUpdate={handleVehiclesUpdate}
          isPlaying={isPlaying}
        />

        {/* Camera */}
        <FollowCamera bikeXRef={bikeXRef} />

        {/* Game Logic */}
        <GameLogic
          bike={bike}
          speedRef={speedRef}
          bikeXRef={bikeXRef}
          bikePositionRef={bikePositionRef}
          vehiclesRef={vehiclesRef}
          isPlaying={isPlaying}
          onGameValuesUpdate={onGameValuesUpdate}
          onCollision={handleCollision}
        />
      </Canvas>

      {/* HUD overlay */}
      <HUD
        speed={speed}
        distance={distance}
        score={score}
        health={health}
        maxHealth={maxHealth}
      />

      {/* Impact flash */}
      <ImpactFlash trigger={impactTrigger} />

      {/* Touch controls */}
      <TouchControls />
    </div>
  );
}
