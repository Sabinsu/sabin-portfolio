import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seeded } from "../../utils/rand";

function Starfield({ count }) {
  const ref = useRef();
  const pos = useMemo(() => {
    const rnd = seeded(5);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 14 + rnd() * 24, th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th); a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); a[i * 3 + 2] = r * Math.cos(ph);
    }
    return a;
  }, [count]);
  useFrame(({ clock }) => { if (ref.current) ref.current.material.size = 0.1 + Math.sin(clock.elapsedTime * 1.5) * 0.025; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial color="#cfe3ff" size={0.1} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

function OrbitRing({ radius, tilt = 0 }) {
  return (
    <mesh rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 6, 128]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
    </mesh>
  );
}

function Planet({ onSelect }) {
  const mesh = useRef();
  useFrame((_, d) => { if (mesh.current) mesh.current.rotation.y += d * 0.15; });
  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect("planet"); }}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial color="#1d449e" emissive="#2f6fed" emissiveIntensity={0.3} roughness={0.8} />
      </mesh>
      <mesh scale={1.1}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#5590fd" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
        <ringGeometry args={[2.1, 3, 80]} />
        <meshBasicMaterial color="#82afff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Moon() {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.5;
    if (g.current) g.current.position.set(Math.cos(t) * 4.2, Math.sin(t * 0.6) * 0.6, Math.sin(t) * 4.2);
  });
  return (
    <mesh ref={g}>
      <sphereGeometry args={[0.32, 24, 24]} />
      <meshStandardMaterial color="#b8a9ff" emissive="#8b7cf6" emissiveIntensity={0.25} />
    </mesh>
  );
}

function Station({ onSelect }) {
  const g = useRef();
  const ring = useRef();
  useFrame(({ clock }, d) => {
    const t = clock.elapsedTime * 0.35;
    if (g.current) { g.current.position.set(Math.cos(t + 2) * 3.4, 1.1, Math.sin(t + 2) * 3.4); g.current.rotation.y += d * 0.3; }
    if (ring.current) ring.current.rotation.z += d * 0.8;
  });
  return (
    <group ref={g} scale={0.55} onClick={(e) => { e.stopPropagation(); onSelect("station"); }}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.4, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[0.7, 0.07, 12, 40]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.8} />
      </mesh>
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.9, 0.03, 0.5]} />
          <meshStandardMaterial color="#2f6fed" emissive="#2f6fed" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Spacecraft({ onSelect }) {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.28;
    const at = (u) => new THREE.Vector3(Math.cos(u) * 6, Math.sin(u * 1.4) * 1.2, Math.sin(u) * 3.2);
    if (g.current) { g.current.position.copy(at(t)); g.current.lookAt(at(t + 0.05)); }
  });
  return (
    <group ref={g} scale={0.6} onClick={(e) => { e.stopPropagation(); onSelect("spacecraft"); }}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.8, 16]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <mesh position={[0.28, 0, -0.1]} rotation={[0, 0, 0]}><boxGeometry args={[0.35, 0.02, 0.25]} /><meshStandardMaterial color="#8b7cf6" /></mesh>
      <mesh position={[-0.28, 0, -0.1]}><boxGeometry args={[0.35, 0.02, 0.25]} /><meshStandardMaterial color="#8b7cf6" /></mesh>
    </group>
  );
}

function World({ rotation, onSelect, lite }) {
  const g = useRef();
  const auto = useRef(0);
  useFrame(() => {
    if (!g.current) return;
    auto.current += 0.0015; // gentle auto-rotation
    g.current.rotation.y += (rotation.current.y + auto.current - g.current.rotation.y) * 0.08;
    g.current.rotation.x += (rotation.current.x - g.current.rotation.x) * 0.08;
  });
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 5, 6]} intensity={90} color="#9ec1ff" />
      <pointLight position={[-6, -3, 3]} intensity={30} color="#8b7cf6" />
      <Starfield count={lite ? 350 : 900} />
      <group ref={g}>
        <Planet onSelect={onSelect} />
        <Moon />
        <Station onSelect={onSelect} />
        <Spacecraft onSelect={onSelect} />
        <OrbitRing radius={3.4} />
        <OrbitRing radius={4.2} tilt={0.35} />
      </group>
    </>
  );
}

export default function AerospaceScene({ rotation, onSelect, lite }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 9.5], fov: 50 }} dpr={[1, lite ? 1 : 1.5]} gl={{ antialias: !lite, alpha: true }}>
      <World rotation={rotation} onSelect={onSelect} lite={lite} />
    </Canvas>
  );
}
