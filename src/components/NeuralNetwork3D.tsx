import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Neural network layer structure
const LAYERS = [
  { count: 6, x: -6, color: '#00d4ff' },
  { count: 8, x: -3, color: '#00e5ff' },
  { count: 10, x: 0, color: '#00ffcc' },
  { count: 8, x: 3, color: '#7cff00' },
  { count: 5, x: 6, color: '#00d4ff' },
];

function NeuralNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(() => {
    const result: { x: number; y: number; z: number; layer: number; speed: number; offset: number; color: string }[] = [];
    LAYERS.forEach((layer, li) => {
      const spacing = 2.2;
      const startY = -((layer.count - 1) * spacing) / 2;
      for (let i = 0; i < layer.count; i++) {
        result.push({
          x: layer.x,
          y: startY + i * spacing,
          z: (Math.random() - 0.5) * 2,
          layer: li,
          speed: 0.3 + Math.random() * 0.4,
          offset: Math.random() * Math.PI * 2,
          color: layer.color,
        });
      }
    });
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();
    nodes.forEach((n, i) => {
      const pulse = Math.sin(t * n.speed * 2 + n.offset);
      dummy.position.set(
        n.x + Math.sin(t * 0.3 + n.offset) * 0.15,
        n.y + Math.cos(t * n.speed + n.offset) * 0.3,
        n.z + Math.sin(t * 0.5 + n.offset) * 0.2
      );
      const scale = 0.12 + pulse * 0.04;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Glow sphere (larger, transparent)
      dummy.scale.setScalar(scale * 3);
      dummy.updateMatrix();
      glowRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  });

  const count = nodes.length;

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#00d4ff" toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.08} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function NeuralConnections() {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const layerA = LAYERS[li];
      const layerB = LAYERS[li + 1];
      const spacingA = 2.2;
      const spacingB = 2.2;
      const startYA = -((layerA.count - 1) * spacingA) / 2;
      const startYB = -((layerB.count - 1) * spacingB) / 2;

      for (let a = 0; a < layerA.count; a++) {
        // Connect to 2-3 random nodes in next layer
        const connectCount = 2 + Math.floor(Math.random() * 2);
        const targets = new Set<number>();
        while (targets.size < Math.min(connectCount, layerB.count)) {
          targets.add(Math.floor(Math.random() * layerB.count));
        }
        targets.forEach(b => {
          conns.push({
            start: new THREE.Vector3(layerA.x, startYA + a * spacingA, 0),
            end: new THREE.Vector3(layerB.x, startYB + b * spacingB, 0),
          });
        });
      }
    }
    return conns;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
    linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.07) * 0.08;
  });

  const geometry = useMemo(() => {
    const positions: number[] = [];
    connections.forEach(c => {
      positions.push(c.start.x, c.start.y, c.start.z);
      positions.push(c.end.x, c.end.y, c.end.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [connections]);

  return (
    <group ref={linesRef}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

function DataParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 120;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 25,
      z: (Math.random() - 0.5) * 15,
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 1.5,
        p.y + Math.cos(t * p.speed * 0.7 + p.offset) * 1,
        p.z + Math.sin(t * p.speed * 0.5) * 0.5
      );
      const pulse = 0.5 + Math.sin(t * 3 + p.offset) * 0.5;
      dummy.scale.setScalar(0.02 + pulse * 0.015);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#7cff00" transparent opacity={0.5} toneMapped={false} />
    </instancedMesh>
  );
}

function SignalPulses() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 30;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const pulses = useMemo(() => {
    return Array.from({ length: count }, () => {
      const layerIdx = Math.floor(Math.random() * (LAYERS.length - 1));
      const layerA = LAYERS[layerIdx];
      const layerB = LAYERS[layerIdx + 1];
      const spacingA = 2.2;
      const spacingB = 2.2;
      const nodeA = Math.floor(Math.random() * layerA.count);
      const nodeB = Math.floor(Math.random() * layerB.count);
      const startYA = -((layerA.count - 1) * spacingA) / 2;
      const startYB = -((layerB.count - 1) * spacingB) / 2;
      
      return {
        startX: layerA.x,
        startY: startYA + nodeA * spacingA,
        endX: layerB.x,
        endY: startYB + nodeB * spacingB,
        speed: 0.5 + Math.random() * 1.5,
        offset: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    pulses.forEach((p, i) => {
      const progress = ((t * p.speed + p.offset) % (Math.PI * 2)) / (Math.PI * 2);
      dummy.position.set(
        p.startX + (p.endX - p.startX) * progress,
        p.startY + (p.endY - p.startY) * progress,
        0
      );
      const brightness = Math.sin(progress * Math.PI);
      dummy.scale.setScalar(0.04 + brightness * 0.03);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.9} toneMapped={false} />
    </instancedMesh>
  );
}

export default function NeuralNetwork3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <NeuralNodes />
        <NeuralConnections />
        <DataParticles />
        <SignalPulses />
      </Canvas>
    </div>
  );
}
