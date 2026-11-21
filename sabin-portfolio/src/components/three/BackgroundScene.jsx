import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointerRef } from "../../hooks/usePointer";
import { seeded } from "../../utils/rand";

function Stars({ count, color }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const rnd = seeded(11);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 18 + rnd() * 40;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.006;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.09} sizeAttenuation transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

function Planet({ position, radius, color, emissive, ring, speed = 0.05, floatAmp = 0.25 }) {
  const group = useRef();
  const mesh = useRef();
  const base = useRef(position[1]);
  useFrame(({ clock }, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * speed;
    if (group.current) group.current.position.y = base.current + Math.sin(clock.elapsedTime * 0.4 + position[0]) * floatAmp;
  });
  return (
    <group ref={group} position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, 40, 40]} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.25} roughness={0.85} metalness={0.1} />
      </mesh>
      {/* atmosphere glow */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial color={emissive} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      {ring && (
        <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.1, 64]} />
          <meshBasicMaterial color={ring} transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function Satellite({ center, orbit = 2.2, speed = 0.5, offset = 0, color }) {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset;
    if (group.current) {
      group.current.position.set(center[0] + Math.cos(t) * orbit, center[1] + Math.sin(t * 1.3) * 0.5, center[2] + Math.sin(t) * orbit);
      group.current.rotation.y = -t;
    }
  });
  return (
    <group ref={group} scale={0.5}>
      <mesh>
        <boxGeometry args={[0.35, 0.25, 0.25]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
      </mesh>
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.6, 0.02, 0.32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function NeuralNetwork({ position, color, nodeCount }) {
  const group = useRef();
  const pointsRef = useRef();
  const { positions, lines } = useMemo(() => {
    const rnd = seeded(7);
    const pts = [];
    for (let i = 0; i < nodeCount; i++) {
      pts.push(new THREE.Vector3((rnd() - 0.5) * 5, (rnd() - 0.5) * 3.2, (rnd() - 0.5) * 3));
    }
    const segs = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.7) segs.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
    return {
      positions: new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])),
      lines: new Float32Array(segs),
    };
  }, [nodeCount]);

  useFrame(({ clock }, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
    if (pointsRef.current) pointsRef.current.material.size = 0.14 + Math.sin(clock.elapsedTime * 2) * 0.04;
  });

  return (
    <group ref={group} position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.14} sizeAttenuation transparent opacity={0.95} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

/** Rising streams of data particles. */
function DataStreams({ count, color }) {
  const ref = useRef();
  const data = useMemo(() => {
    const rnd = seeded(23);
    const pos = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 24;
      pos[i * 3 + 1] = (rnd() - 0.5) * 14;
      pos[i * 3 + 2] = -4 - rnd() * 6;
      speeds[i] = 0.3 + rnd() * 0.8;
    }
    return { pos, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const attr = ref.current?.geometry.attributes.position;
    if (!attr) return;
    for (let i = 0; i < count; i++) {
      let y = attr.array[i * 3 + 1] + data.speeds[i] * delta;
      if (y > 7) y = -7;
      attr.array[i * 3 + 1] = y;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.06} transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}

function HoloGrid({ color }) {
  return (
    <gridHelper args={[60, 60, color, color]} position={[0, -7, -8]} material-transparent material-opacity={0.12} />
  );
}

/** Camera: mouse parallax + gentle scroll-driven drift. */
function CameraRig({ pointer }) {
  useFrame(({ camera }) => {
    const scrollRatio = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    const tx = pointer.current.x * 0.9;
    const ty = pointer.current.y * 0.6 - scrollRatio * 2.2;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, -scrollRatio * 1.6, 0);
  });
  return null;
}

function Scene({ isDark, lite }) {
  const pointer = usePointerRef();
  const accent = isDark ? "#22d3ee" : "#2f6fed";
  const star = isDark ? "#cfe3ff" : "#4a6fb5";
  const purple = isDark ? "#8b7cf6" : "#6d5ce0";

  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.9} />
      <pointLight position={[8, 6, 6]} intensity={isDark ? 60 : 40} color="#6ea8ff" />
      <pointLight position={[-8, -4, 4]} intensity={isDark ? 35 : 20} color={purple} />

      <Stars count={lite ? 500 : 1400} color={star} />
      <DataStreams count={lite ? 40 : 120} color={accent} />
      <HoloGrid color={accent} />

      <Planet position={[5.5, 2.2, -6]} radius={1.7} color="#1d449e" emissive="#2f6fed" ring="#82afff" />
      <Satellite center={[5.5, 2.2, -6]} orbit={3.4} speed={0.45} color={accent} />
      {!lite && (
        <>
          <Planet position={[-7, -2.5, -9]} radius={1.1} color="#3a2a78" emissive="#8b7cf6" speed={0.08} />
          <Satellite center={[-7, -2.5, -9]} orbit={2.1} speed={0.7} offset={2} color={purple} />
          <NeuralNetwork position={[-4.5, 2.4, -4]} color={accent} nodeCount={26} />
        </>
      )}
      <CameraRig pointer={pointer} />
    </>
  );
}

export default function BackgroundScene({ isDark, lite }) {
  const canvasRef = useRef();

  // Free GPU resources if the component unmounts.
  useEffect(() => () => canvasRef.current?.remove?.(), []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" style={{ opacity: isDark ? 1 : 0.5 }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 9], fov: 55 }}
        dpr={[1, lite ? 1 : 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <Scene isDark={isDark} lite={lite} />
      </Canvas>
    </div>
  );
}
