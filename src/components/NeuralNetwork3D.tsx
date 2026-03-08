import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LAYERS = [
  { count: 6, x: -6 },
  { count: 8, x: -3 },
  { count: 10, x: 0 },
  { count: 8, x: 3 },
  { count: 5, x: 6 },
];

function useThemeColors() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return useMemo(() => ({
    node: isDark ? '#00d4ff' : '#2563eb',
    glow: isDark ? '#00d4ff' : '#3b82f6',
    connection: isDark ? '#00d4ff' : '#2563eb',
    connectionOpacity: isDark ? 0.25 : 0.2,
    particle: isDark ? '#7cff00' : '#7c3aed',
    particleOpacity: isDark ? 0.7 : 0.6,
    signal: isDark ? '#ffffff' : '#1e40af',
    signalOpacity: isDark ? 0.9 : 0.8,
    glowOpacity: isDark ? 0.25 : 0.2,
  }), [isDark]);
}

const mousePos = { x: 0, y: 0, targetX: 0, targetY: 0 };

function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    mousePos.x += (mousePos.targetX - mousePos.x) * 0.12;
    mousePos.y += (mousePos.targetY - mousePos.y) * 0.12;
    camera.position.x = mousePos.x * 5;
    camera.position.y = mousePos.y * 3.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function NeuralNodes({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const nodes = useMemo(() => {
    const result: { x: number; y: number; z: number; speed: number; offset: number }[] = [];
    LAYERS.forEach((layer) => {
      const spacing = 2.2;
      const startY = -((layer.count - 1) * spacing) / 2;
      for (let i = 0; i < layer.count; i++) {
        result.push({
          x: layer.x,
          y: startY + i * spacing,
          z: (Math.random() - 0.5) * 2,
          speed: 0.3 + Math.random() * 0.4,
          offset: Math.random() * Math.PI * 2,
        });
      }
    });
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();
    const mx = mousePos.x;
    const my = mousePos.y;
    nodes.forEach((n, i) => {
      const pulse = Math.sin(t * n.speed * 2 + n.offset);
      dummy.position.set(
        n.x + Math.sin(t * 0.5 + n.offset) * 0.3 + mx * 1.2,
        n.y + Math.cos(t * n.speed * 1.5 + n.offset) * 0.4 + my * 0.8,
        n.z + Math.sin(t * 0.7 + n.offset) * 0.3
      );
      const scale = 0.15 + pulse * 0.05;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(scale * 3.5);
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
        <meshBasicMaterial color={colors.node} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={colors.glow} transparent opacity={colors.glowOpacity} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function NeuralConnections({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const linesRef = useRef<THREE.Group>(null);

  const connections = useMemo(() => {
    const conns: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let li = 0; li < LAYERS.length - 1; li++) {
      const layerA = LAYERS[li];
      const layerB = LAYERS[li + 1];
      const spacing = 2.2;
      const startYA = -((layerA.count - 1) * spacing) / 2;
      const startYB = -((layerB.count - 1) * spacing) / 2;
      for (let a = 0; a < layerA.count; a++) {
        const connectCount = 2 + Math.floor(Math.random() * 2);
        const targets = new Set<number>();
        while (targets.size < Math.min(connectCount, layerB.count)) {
          targets.add(Math.floor(Math.random() * layerB.count));
        }
        targets.forEach(b => {
          conns.push({
            start: new THREE.Vector3(layerA.x, startYA + a * spacing, 0),
            end: new THREE.Vector3(layerB.x, startYB + b * spacing, 0),
          });
        });
      }
    }
    return conns;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    linesRef.current.rotation.y = Math.sin(t * 0.15) * 0.2 + mousePos.x * 0.25;
    linesRef.current.rotation.x = Math.sin(t * 0.1) * 0.12 + mousePos.y * 0.2;
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
        <lineBasicMaterial color={colors.connection} transparent opacity={colors.connectionOpacity} />
      </lineSegments>
    </group>
  );
}

function DataParticles({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 20,
      speed: 0.15 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 2 + mousePos.x * 2,
        p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 1.5 + mousePos.y * 1.5,
        p.z + Math.sin(t * p.speed * 0.5) * 0.8
      );
      const pulse = 0.5 + Math.sin(t * 3 + p.offset) * 0.5;
      dummy.scale.setScalar(0.03 + pulse * 0.025);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={colors.particle} transparent opacity={colors.particleOpacity} toneMapped={false} />
    </instancedMesh>
  );
}

function SignalPulses({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const pulses = useMemo(() => {
    return Array.from({ length: count }, () => {
      const layerIdx = Math.floor(Math.random() * (LAYERS.length - 1));
      const layerA = LAYERS[layerIdx];
      const layerB = LAYERS[layerIdx + 1];
      const spacing = 2.2;
      const nodeA = Math.floor(Math.random() * layerA.count);
      const nodeB = Math.floor(Math.random() * layerB.count);
      const startYA = -((layerA.count - 1) * spacing) / 2;
      const startYB = -((layerB.count - 1) * spacing) / 2;
      return {
        startX: layerA.x, startY: startYA + nodeA * spacing,
        endX: layerB.x, endY: startYB + nodeB * spacing,
        speed: 0.8 + Math.random() * 2,
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
      dummy.scale.setScalar(0.05 + brightness * 0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={colors.signal} transparent opacity={colors.signalOpacity} toneMapped={false} />
    </instancedMesh>
  );
}

function Scene() {
  const colors = useThemeColors();
  return (
    <>
      <ambientLight intensity={0.3} />
      <CameraRig />
      <NeuralNodes colors={colors} />
      <NeuralConnections colors={colors} />
      <DataParticles colors={colors} />
      <SignalPulses colors={colors} />
    </>
  );
}

export default function NeuralNetwork3D() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mousePos.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.targetX = 0;
    mousePos.targetY = 0;
  }, []);

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Canvas
        camera={{ position: [0, 0, 18], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
