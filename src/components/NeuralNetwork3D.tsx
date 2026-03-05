import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NeuralNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 200;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 10,
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    positions.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.y + Math.cos(t * p.speed + p.offset) * 0.5,
        p.z + Math.sin(t * p.speed * 0.5) * 0.3
      );
      const scale = 0.03 + Math.sin(t * 2 + p.offset) * 0.015;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
    </instancedMesh>
  );
}

function NeuralLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < 80; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 8
      ));
    }

    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (i < j && a.distanceTo(b) < 4) {
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      });
    });

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00d4ff" transparent opacity={0.12} />
    </lineSegments>
  );
}

export default function NeuralNetwork3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <NeuralNodes />
        <NeuralLines />
      </Canvas>
    </div>
  );
}
