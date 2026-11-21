import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const EXPRESSIONS = {
  neutral: { eye: "#22d3ee", sx: 1, sy: 1, mouth: 0.5 },
  happy: { eye: "#5eead4", sx: 1.1, sy: 0.65, mouth: 1 },
  thinking: { eye: "#a78bfa", sx: 0.9, sy: 0.9, mouth: 0.2 },
  surprised: { eye: "#67e8f9", sx: 1.25, sy: 1.25, mouth: 0.15 },
};

function RobotModel({ pointer, speaking, expression }) {
  const root = useRef();
  const head = useRef();
  const eyeL = useRef();
  const eyeR = useRef();
  const mouth = useRef();
  const armR = useRef();
  const antenna = useRef();
  const eyeMatL = useRef();
  const eyeMatR = useRef();
  const blink = useRef({ next: 2.5, t: -1 });
  const color = useRef(new THREE.Color("#22d3ee"));

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const ex = EXPRESSIONS[expression] || EXPRESSIONS.neutral;

    // body float + subtle sway
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.4) * 0.05;
      root.current.rotation.y += ((pointer.current.x * 0.35) - root.current.rotation.y) * 0.05;
    }
    // head tracks the cursor
    if (head.current) {
      head.current.rotation.y += ((pointer.current.x * 0.7) - head.current.rotation.y) * 0.08;
      head.current.rotation.x += ((-pointer.current.y * 0.4) - head.current.rotation.x) * 0.08;
      head.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }
    // blinking
    const b = blink.current;
    if (t > b.next && b.t < 0) b.t = t;
    let blinkScale = 1;
    if (b.t >= 0) {
      const p = (t - b.t) / 0.16;
      blinkScale = p < 0.5 ? 1 - p * 2 * 0.92 : 0.08 + (p - 0.5) * 2 * 0.92;
      if (p >= 1) {
        b.t = -1;
        b.next = t + 2 + Math.random() * 3.5;
        blinkScale = 1;
      }
    }
    [eyeL, eyeR].forEach((r) => {
      if (r.current) {
        r.current.scale.x += (ex.sx - r.current.scale.x) * 0.15;
        r.current.scale.y += (ex.sy * blinkScale - r.current.scale.y) * 0.4;
      }
    });
    // eye colour
    color.current.lerp(new THREE.Color(ex.eye), 0.1);
    [eyeMatL, eyeMatR].forEach((m) => {
      if (m.current) {
        m.current.color.copy(color.current);
        m.current.emissive.copy(color.current);
      }
    });
    // mouth: speaking animation or expression shape
    if (mouth.current) {
      const target = speaking ? 0.35 + Math.abs(Math.sin(t * 14)) * 0.9 : ex.mouth;
      mouth.current.scale.y += (target - mouth.current.scale.y) * 0.3;
      mouth.current.scale.x += ((expression === "happy" ? 1.3 : 1) - mouth.current.scale.x) * 0.1;
    }
    // waving arm while speaking / happy
    if (armR.current) {
      const wave = speaking || expression === "happy";
      const target = wave ? -2.3 + Math.sin(t * 6) * 0.35 : -0.25;
      armR.current.rotation.z += (target - armR.current.rotation.z) * 0.1;
    }
    if (antenna.current) antenna.current.material.emissiveIntensity = 1 + Math.sin(t * 3) * 0.6;
  });

  const metal = { color: "#dfe7f3", metalness: 0.75, roughness: 0.28 };
  const dark = { color: "#0f1623", metalness: 0.6, roughness: 0.4 };

  return (
    <group ref={root} position={[0, -0.25, 0]}>
      {/* head */}
      <group ref={head} position={[0, 0.95, 0]}>
        <mesh scale={[1, 0.88, 0.92]}>
          <sphereGeometry args={[0.62, 40, 40]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        {/* visor */}
        <mesh position={[0, 0.02, 0.36]} scale={[1, 0.62, 0.55]}>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh ref={eyeL} position={[-0.2, 0.06, 0.58]}>
          <capsuleGeometry args={[0.07, 0.1, 6, 12]} />
          <meshStandardMaterial ref={eyeMatL} color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
        </mesh>
        <mesh ref={eyeR} position={[0.2, 0.06, 0.58]}>
          <capsuleGeometry args={[0.07, 0.1, 6, 12]} />
          <meshStandardMaterial ref={eyeMatR} color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2.2} />
        </mesh>
        <mesh ref={mouth} position={[0, -0.17, 0.6]}>
          <boxGeometry args={[0.22, 0.04, 0.02]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.6} />
        </mesh>
        {/* ear modules */}
        {[-0.64, 0.64].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.14, 0.14, 0.1, 24]} />
            <meshStandardMaterial color="#2f6fed" emissive="#2f6fed" emissiveIntensity={0.8} />
          </mesh>
        ))}
        {/* antenna */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.22, 8]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh ref={antenna} position={[0, 0.76, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#8b7cf6" emissive="#8b7cf6" emissiveIntensity={1.2} />
        </mesh>
      </group>
      {/* neck */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.18, 16]} />
        <meshStandardMaterial {...dark} />
      </mesh>
      {/* torso */}
      <mesh position={[0, -0.15, 0]} scale={[1, 1, 0.75]}>
        <capsuleGeometry args={[0.42, 0.5, 8, 24]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {/* chest core */}
      <mesh position={[0, -0.05, 0.33]}>
        <circleGeometry args={[0.11, 24]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.05, 0.32]}>
        <ringGeometry args={[0.13, 0.17, 32]} />
        <meshStandardMaterial color="#2f6fed" emissive="#2f6fed" emissiveIntensity={1.2} side={THREE.DoubleSide} />
      </mesh>
      {/* arms */}
      <group position={[-0.58, 0.1, 0]} rotation={[0, 0, 0.25]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.1, 0.42, 6, 14]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      </group>
      <group ref={armR} position={[0.58, 0.1, 0]} rotation={[0, 0, -0.25]}>
        <mesh position={[0, -0.28, 0]}>
          <capsuleGeometry args={[0.1, 0.42, 6, 14]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Self-contained robot canvas. `pointer` is a ref with normalised cursor coords.
 */
export default function Robot({ pointer, speaking = false, expression = "neutral" }) {
  return (
    <Canvas
      camera={{ position: [0, 0.35, 3.3], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3, 3]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-2, 0, 2]} intensity={6} color="#5590fd" />
      <pointLight position={[2, -1, 2]} intensity={4} color="#8b7cf6" />
      <RobotModel pointer={pointer} speaking={speaking} expression={expression} />
    </Canvas>
  );
}
