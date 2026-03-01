import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnvironmentProps {
  speedRef: React.MutableRefObject<number>;
}

const ENV_SEGMENT_LENGTH = 80;
const NUM_ENV_SEGMENTS = 4;

interface EnvObject {
  type: 'tree' | 'palm' | 'building' | 'chai' | 'billboard' | 'lamp';
  x: number;
  z: number;
  scale: number;
  color: string;
  side: 'left' | 'right';
}

function PalmTree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 3, 6]} />
        <meshLambertMaterial color="#8B6914" />
      </mesh>
      {/* Fronds */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.8,
            3.2,
            Math.sin((angle * Math.PI) / 180) * 0.8,
          ]}
          rotation={[0.4, (angle * Math.PI) / 180, 0]}
          castShadow
        >
          <coneGeometry args={[0.5, 1.5, 4]} />
          <meshLambertMaterial color="#2d7a2d" />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.6, 5]} />
        <meshLambertMaterial color="#5c3d11" />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.8, 2.0, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[0.55, 1.5, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function ChaiStall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stall base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.5, 1, 1.5]} />
        <meshLambertMaterial color="#d4a017" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshLambertMaterial color="#cc3300" />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 1.8, 0.5]} castShadow>
        <boxGeometry args={[2, 0.5, 0.05]} />
        <meshLambertMaterial color="#ff9933" />
      </mesh>
      {/* Pot */}
      <mesh position={[0.5, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.3, 8]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

function Building({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const height = 3 + Math.random() * 4;
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[2.5, height, 2]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Windows */}
      {[0.5, 1.5, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 1.01]} castShadow>
          <boxGeometry args={[0.5, 0.4, 0.05]} />
          <meshLambertMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Billboard({ position, text }: { position: [number, number, number]; text: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ff9933';
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 50);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText('INDIA', 128, 90);
    return new THREE.CanvasTexture(canvas);
  }, [text]);

  return (
    <group position={position}>
      {/* Post */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 6]} />
        <meshLambertMaterial color="#555555" />
      </mesh>
      {/* Board */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 0.1]} />
        <meshLambertMaterial map={texture} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 5, 6]} />
        <meshLambertMaterial color="#888888" />
      </mesh>
      <mesh position={[0.4, 5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 6]} />
        <meshLambertMaterial color="#888888" />
      </mesh>
      <mesh position={[0.8, 5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshLambertMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={1} />
      </mesh>
      <pointLight position={[0.8, 5, 0]} intensity={0.5} distance={8} color="#ffffcc" />
    </group>
  );
}

export default function Environment({ speedRef }: EnvironmentProps) {
  const groupsRef = useRef<THREE.Group[]>([]);
  const offsetRef = useRef(0);

  const envObjects = useMemo<EnvObject[][]>(() => {
    const segments: EnvObject[][] = [];
    const billboardTexts = ['NAMASTE!', 'CHAI TIME', 'INDIA ROCKS', 'SPEED LIMIT 60', 'WELCOME'];
    const buildingColors = ['#e8c49a', '#d4956a', '#c8a87a', '#b8956a', '#e0b890'];
    const treeColors = ['#2d7a2d', '#1a6b1a', '#3d8b3d', '#4a9a4a'];

    for (let s = 0; s < NUM_ENV_SEGMENTS; s++) {
      const objects: EnvObject[] = [];
      const baseZ = s * ENV_SEGMENT_LENGTH;

      for (let i = 0; i < 12; i++) {
        const z = baseZ + (i / 12) * ENV_SEGMENT_LENGTH;
        const side = i % 2 === 0 ? 'left' : 'right';
        const xBase = side === 'left' ? -10 : 10;
        const xOffset = (Math.random() - 0.5) * 4;
        const typeRoll = Math.random();

        let type: EnvObject['type'];
        if (typeRoll < 0.3) type = 'tree';
        else if (typeRoll < 0.5) type = 'palm';
        else if (typeRoll < 0.65) type = 'building';
        else if (typeRoll < 0.75) type = 'chai';
        else if (typeRoll < 0.85) type = 'billboard';
        else type = 'lamp';

        objects.push({
          type,
          x: xBase + xOffset,
          z,
          scale: 0.7 + Math.random() * 0.6,
          color: type === 'tree' ? treeColors[Math.floor(Math.random() * treeColors.length)] : buildingColors[Math.floor(Math.random() * buildingColors.length)],
          side,
        });
      }

      segments.push(objects);
    }
    return segments;
  }, []);

  const billboardTexts = ['NAMASTE!', 'CHAI TIME', 'INDIA ROCKS', 'SPEED LIMIT 60', 'WELCOME'];

  useFrame((_, delta) => {
    const speed = speedRef.current;
    if (speed <= 0) return;

    offsetRef.current += speed * delta * 0.5;

    groupsRef.current.forEach((grp, i) => {
      if (!grp) return;
      const baseZ = i * ENV_SEGMENT_LENGTH - offsetRef.current % (ENV_SEGMENT_LENGTH * NUM_ENV_SEGMENTS);
      grp.position.z = baseZ;
    });
  });

  return (
    <group>
      {envObjects.map((segObjects, segIdx) => (
        <group
          key={segIdx}
          ref={(el) => {
            if (el) groupsRef.current[segIdx] = el;
          }}
          position={[0, 0, segIdx * ENV_SEGMENT_LENGTH]}
        >
          {segObjects.map((obj, objIdx) => {
            const pos: [number, number, number] = [obj.x, 0, obj.z - segIdx * ENV_SEGMENT_LENGTH];
            if (obj.type === 'tree') {
              return <Tree key={objIdx} position={pos} scale={obj.scale} color={obj.color} />;
            } else if (obj.type === 'palm') {
              return <PalmTree key={objIdx} position={pos} scale={obj.scale} />;
            } else if (obj.type === 'building') {
              return <Building key={objIdx} position={pos} scale={obj.scale} color={obj.color} />;
            } else if (obj.type === 'chai') {
              return <ChaiStall key={objIdx} position={pos} />;
            } else if (obj.type === 'billboard') {
              return <Billboard key={objIdx} position={pos} text={billboardTexts[objIdx % billboardTexts.length]} />;
            } else if (obj.type === 'lamp') {
              return <StreetLamp key={objIdx} position={pos} />;
            }
            return null;
          })}
        </group>
      ))}
    </group>
  );
}
