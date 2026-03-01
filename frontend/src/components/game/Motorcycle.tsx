import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BikeOption } from '../../types/bike';
import { getControls } from '../../hooks/useMotorcycleControls';

interface MotorcycleProps {
  bike: BikeOption;
  speedRef: React.MutableRefObject<number>;
  bikeXRef: React.MutableRefObject<number>;
  bikePositionRef: React.MutableRefObject<THREE.Vector3>;
  onCollisionCheck?: () => void;
  isPlaying: boolean;
}

const ROAD_HALF_WIDTH = 5.5;
const FRICTION = 0.92;
const LATERAL_FRICTION = 0.85;

export default function Motorcycle({
  bike,
  speedRef,
  bikeXRef,
  bikePositionRef,
  isPlaying,
}: MotorcycleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leanRef = useRef(0);
  const lateralSpeedRef = useRef(0);
  const wheelRotRef = useRef(0);

  useEffect(() => {
    speedRef.current = 0;
    bikeXRef.current = 0;
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 0);
    }
  }, [speedRef, bikeXRef]);

  useFrame((_, delta) => {
    if (!groupRef.current || !isPlaying) return;

    const controls = getControls();
    const maxSpeed = bike.maxSpeed / 3.6; // convert km/h to m/s
    const accelRate = bike.accelerationRate;
    const turnSpeed = bike.turnSpeed;

    // Acceleration / braking
    if (controls.accelerate) {
      speedRef.current = Math.min(speedRef.current + accelRate * delta, maxSpeed);
    } else if (controls.brake) {
      speedRef.current = Math.max(speedRef.current - accelRate * 1.5 * delta, 0);
    } else {
      // Natural deceleration
      speedRef.current = Math.max(speedRef.current - accelRate * 0.3 * delta, 0);
    }

    // Steering
    const speedFactor = Math.min(speedRef.current / maxSpeed, 1);
    if (controls.left) {
      lateralSpeedRef.current -= turnSpeed * speedFactor * delta * 8;
      leanRef.current = THREE.MathUtils.lerp(leanRef.current, 0.35, delta * 4);
    } else if (controls.right) {
      lateralSpeedRef.current += turnSpeed * speedFactor * delta * 8;
      leanRef.current = THREE.MathUtils.lerp(leanRef.current, -0.35, delta * 4);
    } else {
      leanRef.current = THREE.MathUtils.lerp(leanRef.current, 0, delta * 5);
    }

    // Apply lateral friction
    lateralSpeedRef.current *= LATERAL_FRICTION;

    // Update X position
    bikeXRef.current += lateralSpeedRef.current * delta;
    bikeXRef.current = THREE.MathUtils.clamp(bikeXRef.current, -ROAD_HALF_WIDTH, ROAD_HALF_WIDTH);

    // Update wheel rotation
    wheelRotRef.current += speedRef.current * delta * 2;

    // Apply to mesh
    groupRef.current.position.x = bikeXRef.current;
    groupRef.current.rotation.z = leanRef.current;

    // Update shared position ref for collision detection
    bikePositionRef.current.set(bikeXRef.current, 0.5, 0);
  });

  const bikeColor = bike.color;
  const accentColor = bike.id === 'bullet' ? '#c0a060' : bike.id === 'sport' ? '#ff6600' : '#ff9933';

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 1.8]} />
        <meshLambertMaterial color={bikeColor} />
      </mesh>

      {/* Fuel tank */}
      <mesh position={[0, 0.95, 0.1]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.7]} />
        <meshLambertMaterial color={bikeColor} />
      </mesh>

      {/* Seat */}
      <mesh position={[0, 0.95, -0.4]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.7]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>

      {/* Handlebar */}
      <mesh position={[0, 1.05, 0.65]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshLambertMaterial color="#888888" />
      </mesh>

      {/* Headlight */}
      <mesh position={[0, 0.85, 0.92]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.8} />
      </mesh>

      {/* Front fork */}
      <mesh position={[0, 0.45, 0.75]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 6]} />
        <meshLambertMaterial color="#888888" />
      </mesh>

      {/* Front wheel */}
      <group position={[0, 0.28, 0.95]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.28, 0.08, 8, 16]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
          <meshLambertMaterial color="#888888" />
        </mesh>
      </group>

      {/* Rear wheel */}
      <group position={[0, 0.28, -0.85]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.3, 0.09, 8, 16]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 12]} />
          <meshLambertMaterial color="#888888" />
        </mesh>
      </group>

      {/* Exhaust pipe */}
      <mesh position={[0.28, 0.4, -0.3]} rotation={[0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.0, 6]} />
        <meshLambertMaterial color="#aaaaaa" />
      </mesh>

      {/* Accent stripe */}
      <mesh position={[0, 0.68, 0.1]} castShadow>
        <boxGeometry args={[0.56, 0.05, 1.6]} />
        <meshLambertMaterial color={accentColor} />
      </mesh>

      {/* Rider silhouette */}
      <group position={[0, 1.3, -0.1]}>
        {/* Torso */}
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.55, 0.3]} />
          <meshLambertMaterial color="#2a2a4a" />
        </mesh>
        {/* Head with helmet */}
        <mesh position={[0, 0.42, 0.05]} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshLambertMaterial color="#ff9933" />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0.42, 0.22]} castShadow>
          <boxGeometry args={[0.22, 0.12, 0.05]} />
          <meshLambertMaterial color="#333366" />
        </mesh>
      </group>

      {/* Headlight glow */}
      <pointLight position={[0, 0.85, 1.2]} intensity={1.5} distance={12} color="#ffffee" />
    </group>
  );
}
