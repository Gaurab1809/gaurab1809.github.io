import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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
    isDark,
    core: isDark ? '#00d4ff' : '#2563eb',
    coreGlow: isDark ? '#00d4ff' : '#3b82f6',
    accent: isDark ? '#7cff00' : '#7c3aed',
    ring: isDark ? '#00d4ff' : '#2563eb',
    ringOpacity: isDark ? 0.12 : 0.18,
    node: isDark ? '#00d4ff' : '#2563eb',
    nodeGlow: isDark ? '#00d4ff' : '#3b82f6',
    connection: isDark ? '#00d4ff' : '#2563eb',
    connectionOpacity: isDark ? 0.18 : 0.25,
    particle: isDark ? '#7cff00' : '#7c3aed',
    particleOpacity: isDark ? 0.5 : 0.65,
    signal: isDark ? '#ffffff' : '#1e40af',
    signalOpacity: isDark ? 0.85 : 0.9,
    glowOpacity: isDark ? 0.2 : 0.25,
  }), [isDark]);
}

const mousePos = { x: 0, y: 0, targetX: 0, targetY: 0 };

function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    mousePos.x += (mousePos.targetX - mousePos.x) * 0.08;
    mousePos.y += (mousePos.targetY - mousePos.y) * 0.08;
    camera.position.x = mousePos.x * 3;
    camera.position.y = mousePos.y * 2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Central glowing core node
function CoreNode({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      const scale = 0.6 + Math.sin(t * 2) * 0.08;
      coreRef.current.scale.setScalar(scale);
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (glowRef.current) {
      const glowScale = 1.2 + Math.sin(t * 1.5) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 2) * 0.04;
    }
    if (pulseRef.current) {
      const pulseScale = 1.5 + Math.sin(t * 1) * 0.5;
      pulseRef.current.scale.setScalar(pulseScale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(t * 1) * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={colors.core} wireframe toneMapped={false} />
      </mesh>
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={colors.coreGlow} transparent opacity={0.1} toneMapped={false} />
      </mesh>
      {/* Outer pulse wave */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={colors.coreGlow} transparent opacity={0.04} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Orbiting rings around the core
function OrbitalRings({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.2) * 0.1;
      ring1Ref.current.rotation.z = t * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2.2 + Math.cos(t * 0.15) * 0.15;
      ring2Ref.current.rotation.y = t * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 4 + Math.sin(t * 0.18) * 0.1;
      ring3Ref.current.rotation.z = -t * 0.1;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.015, 16, 100]} />
        <meshBasicMaterial color={colors.ring} transparent opacity={colors.ringOpacity * 2} toneMapped={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.012, 16, 100]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={colors.ringOpacity * 1.5} toneMapped={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4.0, 0.01, 16, 100]} />
        <meshBasicMaterial color={colors.ring} transparent opacity={colors.ringOpacity} toneMapped={false} />
      </mesh>
    </>
  );
}

// Orbiting micro-nodes (projects, skills, research)
function OrbitingNodes({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 24;

  const nodes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const orbit = 2.2 + Math.random() * 2.5;
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const tilt = (Math.random() - 0.5) * Math.PI * 0.6;
      return {
        orbit,
        angle,
        tilt,
        speed: 0.15 + Math.random() * 0.25,
        size: 0.06 + Math.random() * 0.08,
        yOffset: (Math.random() - 0.5) * 1.5,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();
    const mx = mousePos.x * 0.5;
    const my = mousePos.y * 0.3;
    nodes.forEach((n, i) => {
      const a = n.angle + t * n.speed;
      const x = Math.cos(a) * n.orbit * Math.cos(n.tilt) + mx;
      const y = Math.sin(a) * n.orbit * Math.sin(n.tilt) + n.yOffset + my;
      const z = Math.sin(a) * n.orbit * Math.cos(n.tilt) * 0.5;
      
      // Magnetic pull toward cursor
      const distToCursor = Math.sqrt((mousePos.x - x / 5) ** 2 + (mousePos.y - y / 5) ** 2);
      const pull = Math.max(0, 1 - distToCursor * 2) * 0.3;
      
      dummy.position.set(
        x + mousePos.x * pull * 2,
        y + mousePos.y * pull * 2,
        z
      );
      const pulse = 1 + Math.sin(t * 3 + i) * 0.2;
      dummy.scale.setScalar(n.size * pulse);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(n.size * pulse * 3);
      dummy.updateMatrix();
      glowRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={colors.node} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={glowRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={colors.nodeGlow} transparent opacity={colors.glowOpacity} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

// Dynamic neural connections from core to orbiting nodes
function DynamicConnections({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const positionsRef = useRef(new Float32Array(24 * 2 * 3));
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24 * 2 * 3), 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const t = clock.getElapsedTime();
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < 24; i++) {
      const orbit = 2.2 + (i / 24) * 2.5;
      const angle = (i / 24) * Math.PI * 2 + t * (0.15 + (i % 5) * 0.05);
      const tilt = ((i % 7) / 7 - 0.5) * Math.PI * 0.6;
      
      const x = Math.cos(angle) * orbit * Math.cos(tilt);
      const y = Math.sin(angle) * orbit * Math.sin(tilt) + ((i % 3) - 1) * 0.5;
      const z = Math.sin(angle) * orbit * Math.cos(tilt) * 0.5;
      
      // From core (0,0,0) to node
      positions[i * 6] = 0;
      positions[i * 6 + 1] = 0;
      positions[i * 6 + 2] = 0;
      positions[i * 6 + 3] = x + mousePos.x * 0.5;
      positions[i * 6 + 4] = y + mousePos.y * 0.3;
      positions[i * 6 + 5] = z;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color={colors.connection} transparent opacity={colors.connectionOpacity * 0.7} toneMapped={false} />
    </lineSegments>
  );
}

// Background floating particles with depth
function BackgroundParticles({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 150;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 35,
      y: (Math.random() - 0.5) * 25,
      z: -5 - Math.random() * 15,
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      size: 0.02 + Math.random() * 0.03,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 1.5 + mousePos.x * 1.5,
        p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 1 + mousePos.y * 1,
        p.z + Math.sin(t * p.speed * 0.3) * 0.5
      );
      const pulse = 0.5 + Math.sin(t * 2 + p.offset) * 0.5;
      dummy.scale.setScalar(p.size + pulse * 0.015);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={colors.particle} transparent opacity={colors.particleOpacity * 0.6} toneMapped={false} />
    </instancedMesh>
  );
}

// Signal pulses traveling along connections
function SignalPulses({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 30;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const pulses = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      orbit: 2.2 + Math.random() * 2.5,
      angle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * Math.PI * 0.6,
      speed: 1 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    pulses.forEach((p, i) => {
      const progress = ((t * p.speed + p.offset) % (Math.PI * 2)) / (Math.PI * 2);
      const a = p.angle + t * 0.2;
      const x = Math.cos(a) * p.orbit * Math.cos(p.tilt) * progress;
      const y = Math.sin(a) * p.orbit * Math.sin(p.tilt) * progress;
      const z = Math.sin(a) * p.orbit * Math.cos(p.tilt) * 0.5 * progress;
      
      dummy.position.set(x, y, z);
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
      <meshBasicMaterial color={colors.signal} transparent opacity={colors.signalOpacity} toneMapped={false} />
    </instancedMesh>
  );
}

// Holographic grid floor
function HoloGrid({ colors }: { colors: ReturnType<typeof useThemeColors> }) {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame(({ clock }) => {
    if (!gridRef.current) return;
    const t = clock.getElapsedTime();
    gridRef.current.position.y = -6;
    gridRef.current.position.z = -3;
    (gridRef.current.material as THREE.Material).opacity = colors.isDark ? 0.06 : 0.04;
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[40, 40, colors.core, colors.core]}
      rotation={[0, 0, 0]}
      position={[0, -6, -3]}
    >
      <meshBasicMaterial color={colors.core} transparent opacity={0.05} />
    </gridHelper>
  );
}

function Scene() {
  const colors = useThemeColors();
  return (
    <>
      <ambientLight intensity={0.2} />
      <CameraRig />
      <CoreNode colors={colors} />
      <OrbitalRings colors={colors} />
      <OrbitingNodes colors={colors} />
      <DynamicConnections colors={colors} />
      <BackgroundParticles colors={colors} />
      <SignalPulses colors={colors} />
      <HoloGrid colors={colors} />
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
        camera={{ position: [0, 0, 12], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
