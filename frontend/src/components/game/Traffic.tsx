import { useRef, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VehicleData } from '../../hooks/useCollisionDetection';

interface TrafficProps {
  speedRef: React.MutableRefObject<number>;
  bikeXRef: React.MutableRefObject<number>;
  score: number;
  onVehiclesUpdate: (vehicles: VehicleData[]) => void;
  isPlaying: boolean;
}

interface Vehicle {
  id: string;
  type: 'rickshaw' | 'truck' | 'car' | 'bus';
  x: number;
  z: number;
  speed: number;
  direction: 1 | -1; // 1 = same direction, -1 = oncoming
  color: string;
  width: number;
  height: number;
  depth: number;
}

const LANE_POSITIONS = [-4, -1.5, 1.5, 4];
const SPAWN_Z = -60;
const DESPAWN_Z = 30;

let vehicleIdCounter = 0;

function RickshawMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.2, 1.0, 2.0]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Canopy */}
      <mesh position={[0, 1.2, 0.2]} castShadow>
        <boxGeometry args={[1.3, 0.15, 1.6]} />
        <meshLambertMaterial color="#ffcc00" />
      </mesh>
      {/* Front wheel */}
      <mesh position={[0, 0.25, 0.85]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.22, 0.07, 6, 12]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Rear left wheel */}
      <mesh position={[-0.55, 0.25, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.22, 0.07, 6, 12]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Rear right wheel */}
      <mesh position={[0.55, 0.25, -0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.22, 0.07, 6, 12]} />
        <meshLambertMaterial color="#1a1a1a" />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 0.7, 1.02]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function TruckMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Cabin */}
      <mesh position={[0, 1.0, 1.2]} castShadow>
        <boxGeometry args={[2.2, 1.8, 1.8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Cargo */}
      <mesh position={[0, 1.2, -1.0]} castShadow>
        <boxGeometry args={[2.2, 2.2, 3.5]} />
        <meshLambertMaterial color="#cc6600" />
      </mesh>
      {/* Decorations on cargo */}
      <mesh position={[0, 2.2, -1.0]} castShadow>
        <boxGeometry args={[2.21, 0.1, 3.51]} />
        <meshLambertMaterial color="#ff9933" />
      </mesh>
      {/* Wheels */}
      {[[-0.9, -1.8], [0.9, -1.8], [-0.9, 0.8], [0.9, 0.8]].map(([wx, wz], i) => (
        <mesh key={i} position={[wx, 0.35, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.32, 0.1, 6, 12]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[-0.6, 0.9, 2.12]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.6, 0.9, 2.12]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function CarMesh({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.6, 0.7, 3.5]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.95, -0.1]} castShadow>
        <boxGeometry args={[1.4, 0.6, 2.0]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.95, 0.85]} castShadow>
        <boxGeometry args={[1.35, 0.55, 0.05]} />
        <meshLambertMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      {[[-0.75, -1.3], [0.75, -1.3], [-0.75, 1.3], [0.75, 1.3]].map(([wx, wz], i) => (
        <mesh key={i} position={[wx, 0.25, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.24, 0.08, 6, 12]} />
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[-0.5, 0.5, 1.78]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.5, 0.5, 1.78]}>
        <boxGeometry args={[0.25, 0.15, 0.05]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function Traffic({ speedRef, bikeXRef, score, onVehiclesUpdate, isPlaying }: TrafficProps) {
  const vehiclesRef = useRef<Vehicle[]>([]);
  const meshRefs = useRef<Map<string, THREE.Group>>(new Map());
  const spawnTimerRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  const getSpawnInterval = useCallback(() => {
    const base = 2.5;
    const reduction = Math.min(score / 500, 1.5);
    return Math.max(base - reduction, 0.8);
  }, [score]);

  const spawnVehicle = useCallback(() => {
    const types: Vehicle['type'][] = ['rickshaw', 'car', 'car', 'truck', 'rickshaw'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = LANE_POSITIONS[Math.floor(Math.random() * LANE_POSITIONS.length)];
    const direction: 1 | -1 = Math.random() > 0.3 ? 1 : -1;

    const colors = {
      rickshaw: ['#ffcc00', '#ff9933', '#00cc44', '#0066cc'],
      truck: ['#cc6600', '#ff3300', '#0044cc', '#006600'],
      car: ['#cc0000', '#0044cc', '#006600', '#888888', '#ffffff'],
      bus: ['#ff9933', '#cc0000'],
    };

    const colorList = colors[type];
    const color = colorList[Math.floor(Math.random() * colorList.length)];

    const dims = {
      rickshaw: { w: 1.2, h: 1.2, d: 2.0 },
      truck: { w: 2.2, h: 2.2, d: 5.0 },
      car: { w: 1.6, h: 1.0, d: 3.5 },
      bus: { w: 2.0, h: 2.5, d: 6.0 },
    };

    const dim = dims[type];
    const baseSpeed = 8 + Math.random() * 6;

    const vehicle: Vehicle = {
      id: `v_${vehicleIdCounter++}`,
      type,
      x: lane,
      z: direction === 1 ? SPAWN_Z : DESPAWN_Z,
      speed: direction === 1 ? baseSpeed : baseSpeed * 0.8,
      direction,
      color,
      width: dim.w,
      height: dim.h,
      depth: dim.d,
    };

    vehiclesRef.current.push(vehicle);
  }, []);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    const playerSpeed = speedRef.current;

    // Spawn timer
    spawnTimerRef.current += delta;
    if (spawnTimerRef.current >= getSpawnInterval()) {
      spawnTimerRef.current = 0;
      spawnVehicle();
    }

    // Update vehicle positions
    const toRemove: string[] = [];
    vehiclesRef.current.forEach((vehicle) => {
      if (vehicle.direction === 1) {
        // Same direction - move relative to player speed
        vehicle.z += (playerSpeed - vehicle.speed) * delta;
        if (vehicle.z > DESPAWN_Z) toRemove.push(vehicle.id);
      } else {
        // Oncoming - move toward player
        vehicle.z -= (playerSpeed + vehicle.speed) * delta;
        if (vehicle.z < SPAWN_Z) toRemove.push(vehicle.id);
      }

      // Update mesh position
      const mesh = meshRefs.current.get(vehicle.id);
      if (mesh) {
        mesh.position.set(vehicle.x, 0, vehicle.z);
        if (vehicle.direction === -1) {
          mesh.rotation.y = Math.PI;
        }
      }
    });

    // Remove out-of-bounds vehicles
    vehiclesRef.current = vehiclesRef.current.filter((v) => !toRemove.includes(v.id));
    toRemove.forEach((id) => meshRefs.current.delete(id));

    // Update collision data
    const vehicleData: VehicleData[] = vehiclesRef.current.map((v) => ({
      id: v.id,
      position: new THREE.Vector3(v.x, v.height / 2, v.z),
      width: v.width,
      height: v.height,
      depth: v.depth,
    }));
    onVehiclesUpdate(vehicleData);
  });

  return (
    <group ref={groupRef}>
      {vehiclesRef.current.map((vehicle) => (
        <group
          key={vehicle.id}
          ref={(el) => {
            if (el) meshRefs.current.set(vehicle.id, el);
            else meshRefs.current.delete(vehicle.id);
          }}
          position={[vehicle.x, 0, vehicle.z]}
        >
          {vehicle.type === 'rickshaw' && <RickshawMesh color={vehicle.color} />}
          {vehicle.type === 'truck' && <TruckMesh color={vehicle.color} />}
          {(vehicle.type === 'car' || vehicle.type === 'bus') && <CarMesh color={vehicle.color} />}
        </group>
      ))}
    </group>
  );
}
