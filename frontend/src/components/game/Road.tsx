import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoadProps {
  speedRef: React.MutableRefObject<number>;
  bikeXRef: React.MutableRefObject<number>;
}

const ROAD_LENGTH = 80;
const ROAD_WIDTH = 12;
const NUM_SEGMENTS = 4;

export default function Road({ speedRef, bikeXRef }: RoadProps) {
  const segmentsRef = useRef<THREE.Group[]>([]);
  const offsetRef = useRef(0);

  const roadTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Asphalt base
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);

    // Asphalt texture noise
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 2 + 0.5;
      const brightness = Math.floor(Math.random() * 30 + 30);
      ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
      ctx.fillRect(x, y, size, size);
    }

    // Lane markings - center dashed line
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 6;
    ctx.setLineDash([40, 30]);
    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    // Side lane lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(384, 0);
    ctx.lineTo(384, 512);
    ctx.stroke();

    // Road edges
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(502, 0);
    ctx.lineTo(502, 512);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 3);
    return texture;
  }, []);

  const shoulderTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#c8a96e';
    ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const brightness = Math.floor(Math.random() * 20 + 180);
      ctx.fillStyle = `rgb(${brightness},${Math.floor(brightness * 0.85)},${Math.floor(brightness * 0.55)})`;
      ctx.fillRect(x, y, 2, 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 8);
    return texture;
  }, []);

  useFrame((_, delta) => {
    const speed = speedRef.current;
    if (speed <= 0) return;

    offsetRef.current += speed * delta * 0.5;

    segmentsRef.current.forEach((seg, i) => {
      if (!seg) return;
      const baseZ = i * ROAD_LENGTH - offsetRef.current % (ROAD_LENGTH * NUM_SEGMENTS);
      seg.position.z = baseZ;
    });
  });

  return (
    <group>
      {Array.from({ length: NUM_SEGMENTS }).map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) segmentsRef.current[i] = el;
          }}
          position={[0, 0, i * ROAD_LENGTH]}
        >
          {/* Main road surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[ROAD_WIDTH, ROAD_LENGTH]} />
            <meshLambertMaterial map={roadTexture} />
          </mesh>

          {/* Left shoulder */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-ROAD_WIDTH / 2 - 4, 0, 0]} receiveShadow>
            <planeGeometry args={[8, ROAD_LENGTH]} />
            <meshLambertMaterial map={shoulderTexture} />
          </mesh>

          {/* Right shoulder */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROAD_WIDTH / 2 + 4, 0, 0]} receiveShadow>
            <planeGeometry args={[8, ROAD_LENGTH]} />
            <meshLambertMaterial map={shoulderTexture} />
          </mesh>

          {/* Curb left */}
          <mesh position={[-ROAD_WIDTH / 2 - 0.15, 0.05, 0]} receiveShadow>
            <boxGeometry args={[0.3, 0.1, ROAD_LENGTH]} />
            <meshLambertMaterial color="#cccccc" />
          </mesh>

          {/* Curb right */}
          <mesh position={[ROAD_WIDTH / 2 + 0.15, 0.05, 0]} receiveShadow>
            <boxGeometry args={[0.3, 0.1, ROAD_LENGTH]} />
            <meshLambertMaterial color="#cccccc" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
