'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, ContactShadows, Html, Environment } from '@react-three/drei';
import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import * as THREE from 'three';
import { Globe, Twitter, Github } from 'lucide-react';

const WindowsColors = {
  bg: '#c0c0c0',
  titleBg: '#000080',
  titleText: '#ffffff',
  text: '#000000',
  folder: '#ffcc00',
  folderBack: '#e6b800',
  paper: '#ffffff',
  progressBg: '#ffffff',
  progressFill: '#000080',
  borderLight: '#ffffff',
  borderDark: '#808080',
  borderDarker: '#000000',
};

function Folder({ position, rotation, isEmpty = false }: { position: [number, number, number], rotation?: [number, number, number], isEmpty?: boolean }) {
  const { shape, foldShape } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.35, -0.225);
    s.lineTo(0.35, -0.225);
    s.lineTo(0.35, 0.1);
    s.lineTo(0.2, 0.225);
    s.lineTo(-0.35, 0.225);
    s.lineTo(-0.35, -0.225);

    const fs = new THREE.Shape();
    fs.moveTo(0.35, 0.1);
    fs.lineTo(0.2, 0.1);
    fs.lineTo(0.2, 0.225);
    fs.lineTo(0.35, 0.1);

    return { shape: s, foldShape: fs };
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Back flap */}
      <mesh position={[0, 0.05, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color={WindowsColors.folderBack} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Tab */}
      <mesh position={[-0.2, 0.35, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
        <meshStandardMaterial color={WindowsColors.folderBack} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Papers inside */}
      {!isEmpty && (
        <group position={[0, 0.15, 0]}>
          {/* Paper 1 (Back) */}
          <group position={[-0.05, 0.1, -0.02]} rotation={[0, 0, 0.15]}>
            <mesh position={[0, 0, -0.005]} castShadow receiveShadow>
              <extrudeGeometry args={[shape, { depth: 0.01, bevelEnabled: false }]} />
              <meshStandardMaterial color={WindowsColors.paper} roughness={0.9} metalness={0.0} />
            </mesh>
            <mesh position={[0, 0, 0.006]} castShadow receiveShadow>
              <extrudeGeometry args={[foldShape, { depth: 0.002, bevelEnabled: false }]} />
              <meshStandardMaterial color="#e0e0e0" roughness={0.9} metalness={0.0} />
            </mesh>
          </group>
          {/* Paper 2 (Front) */}
          <group position={[0.05, 0.05, 0.01]} rotation={[0, 0, -0.1]}>
            <mesh position={[0, 0, -0.005]} castShadow receiveShadow>
              <extrudeGeometry args={[shape, { depth: 0.01, bevelEnabled: false }]} />
              <meshStandardMaterial color={WindowsColors.paper} roughness={0.9} metalness={0.0} />
            </mesh>
            <mesh position={[0, 0, 0.006]} castShadow receiveShadow>
              <extrudeGeometry args={[foldShape, { depth: 0.002, bevelEnabled: false }]} />
              <meshStandardMaterial color="#e0e0e0" roughness={0.9} metalness={0.0} />
            </mesh>
          </group>
        </group>
      )}
      {/* Front flap */}
      <mesh position={[0, 0, 0.05]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color={WindowsColors.folder} roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

function Paper({ offset }: { offset: number }) {
  const paperRef = useRef<THREE.Group>(null);

  const { shape, foldShape } = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.15, -0.2);
    s.lineTo(0.15, -0.2);
    s.lineTo(0.15, 0.1);
    s.lineTo(0.05, 0.2);
    s.lineTo(-0.15, 0.2);
    s.lineTo(-0.15, -0.2);

    const fs = new THREE.Shape();
    fs.moveTo(0.15, 0.1);
    fs.lineTo(0.05, 0.1);
    fs.lineTo(0.05, 0.2);
    fs.lineTo(0.15, 0.1);

    return { shape: s, foldShape: fs };
  }, []);

  useFrame((state) => {
    if (paperRef.current) {
      const time = state.clock.elapsedTime;
      const speed = 0.4; // cycles per second
      let progress = (time * speed + offset) % 1.0;
      
      const x = -1.5 + progress * 3.0;
      const y = 0.4 + Math.sin(progress * Math.PI) * 0.8;
      const z = 0.0 + Math.sin(progress * Math.PI) * 0.3;

      paperRef.current.position.set(x, y, z);
      paperRef.current.rotation.z = -progress * Math.PI * 2;
      paperRef.current.rotation.x = Math.sin(progress * Math.PI) * Math.PI * 0.5;
      paperRef.current.rotation.y = Math.sin(progress * Math.PI) * Math.PI * 0.2;
    }
  });

  return (
    <group ref={paperRef}>
      <mesh position={[0, 0, -0.01]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color={WindowsColors.paper} roughness={0.9} metalness={0.0} />
      </mesh>
      {/* Folded corner */}
      <mesh position={[0, 0, 0.011]} castShadow receiveShadow>
        <extrudeGeometry args={[foldShape, { depth: 0.005, bevelEnabled: false }]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.9} metalness={0.0} />
      </mesh>
      {/* lines */}
      <mesh position={[-0.02, 0.1, 0.016]}>
        <boxGeometry args={[0.16, 0.02, 0.001]} />
        <meshBasicMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0, 0.016]}>
        <boxGeometry args={[0.2, 0.02, 0.001]} />
        <meshBasicMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, -0.1, 0.016]}>
        <boxGeometry args={[0.2, 0.02, 0.001]} />
        <meshBasicMaterial color="#cccccc" />
      </mesh>
    </group>
  );
}

function FlyingPapers() {
  const papers = useMemo(() => Array.from({ length: 6 }).map((_, i) => i), []);

  return (
    <group>
      {papers.map((i) => (
        <Paper key={i} offset={i * (1 / 6)} />
      ))}
    </group>
  );
}

const FILES = [
  "setup.exe",
  "winamp.exe",
  "winzip95.exe",
  "netscape.exe",
  "quake.exe",
  "wolf3d.exe",
  "duke3d.exe",
  "simcity2000.exe",
  "screensaver.scr",
  "IE4setup.exe",
  "DirectX.exe",
  "level1.pak",
  "config.sys",
  "autoexec.bat",
  "command.com",
  "PROGRA~1",
  "WINWORD.EXE",
  "COOLPRO~1",
  "DOWLOAD~1",
  "INTERN~1",
  "MYDOCU~1"
];

function Dialog({ delayTimeMs }: { delayTimeMs: number }) {
  const [blockIndex, setBlockIndex] = useState(0);
  const timeAccumulator = useRef(0);
  const totalBlocks = 21;

  useFrame((state, delta) => {
    timeAccumulator.current += delta;
    const delaySeconds = delayTimeMs / 1000;
    if (timeAccumulator.current >= delaySeconds) {
      timeAccumulator.current -= delaySeconds;
      setBlockIndex((prev) => {
        if (prev >= totalBlocks) return 0;
        return prev + 1;
      });
    }
  });

  const progress = blockIndex / totalBlocks;
  const currentFile = FILES[Math.min(Math.floor(progress * FILES.length), FILES.length - 1)];

  return (
    <group>
      {/* Main Dialog Box */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 3, 0.2]} />
        <meshStandardMaterial color={WindowsColors.bg} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* 3D Borders (Light top/left, Dark bottom/right) */}
      <mesh position={[0, 1.48, 0.115]}>
        <boxGeometry args={[5.96, 0.04, 0.02]} />
        <meshBasicMaterial color={WindowsColors.borderLight} />
      </mesh>
      <mesh position={[-2.98, 0, 0.115]}>
        <boxGeometry args={[0.04, 2.96, 0.02]} />
        <meshBasicMaterial color={WindowsColors.borderLight} />
      </mesh>
      <mesh position={[0, -1.48, 0.115]}>
        <boxGeometry args={[5.96, 0.04, 0.02]} />
        <meshBasicMaterial color={WindowsColors.borderDarker} />
      </mesh>
      <mesh position={[2.98, 0, 0.115]}>
        <boxGeometry args={[0.04, 2.96, 0.02]} />
        <meshBasicMaterial color={WindowsColors.borderDarker} />
      </mesh>

      {/* Title Bar */}
      <mesh position={[0, 1.25, 0.12]}>
        <boxGeometry args={[5.8, 0.3, 0.05]} />
        <meshStandardMaterial color={WindowsColors.titleBg} roughness={0.5} metalness={0.4} />
      </mesh>
      <Text
        position={[-2.8, 1.25, 0.15]}
        fontSize={0.15}
        color={WindowsColors.titleText}
        anchorX="left"
        anchorY="middle"
      >
        Copying...
      </Text>

      {/* Close Button */}
      <group position={[2.7, 1.25, 0.15]}>
        <mesh>
          <boxGeometry args={[0.25, 0.25, 0.05]} />
          <meshStandardMaterial color={WindowsColors.bg} roughness={0.8} metalness={0.2} />
        </mesh>
        <mesh position={[-0.11, 0, 0.035]}>
          <boxGeometry args={[0.02, 0.23, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>
        <mesh position={[0, 0.11, 0.035]}>
          <boxGeometry args={[0.23, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>
        <mesh position={[0.11, 0, 0.035]}>
          <boxGeometry args={[0.02, 0.23, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDarker} />
        </mesh>
        <mesh position={[0, -0.11, 0.035]}>
          <boxGeometry args={[0.23, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDarker} />
        </mesh>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.15}
          color={WindowsColors.text}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          X
        </Text>
      </group>

      {/* Folders */}
      <Folder position={[-1.5, 0.4, 0.1]} />
      <Folder position={[1.5, 0.4, 0.1]} isEmpty={true} />

      {/* Flying Papers */}
      <FlyingPapers />

      {/* Text */}
      <Text
        position={[-2.7, -0.2, 0.11]}
        fontSize={0.15}
        color={WindowsColors.text}
        anchorX="left"
        anchorY="middle"
      >
        {currentFile}
      </Text>
      <Text
        position={[-2.7, -0.5, 0.11]}
        fontSize={0.15}
        color={WindowsColors.text}
        anchorX="left"
        anchorY="middle"
      >
        {`From 'C:\\Documents and Settings\\jay\\My Documents' to 'D:\\jay'`}
      </Text>

      {/* Progress Bar Container */}
      <group position={[-0.6, -1.0, 0.11]}>
        {/* Outer Box (Sunken) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 0.2, 0.02]} />
          <meshStandardMaterial color={WindowsColors.progressBg} roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Sunken Borders */}
        <mesh position={[-2.09, 0, 0.02]}>
          <boxGeometry args={[0.02, 0.18, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDark} />
        </mesh>
        <mesh position={[0, 0.09, 0.02]}>
          <boxGeometry args={[4.18, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDark} />
        </mesh>
        <mesh position={[2.09, 0, 0.02]}>
          <boxGeometry args={[0.02, 0.18, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>
        <mesh position={[0, -0.09, 0.02]}>
          <boxGeometry args={[4.18, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>

        {/* Inner Fill Blocks */}
        {Array.from({ length: totalBlocks }).map((_, i) => {
          const isVisible = i < blockIndex;
          if (!isVisible) return null;
          
          return (
            <mesh key={i} position={[-2.0 + i * 0.2, 0, 0.01]}>
              <boxGeometry args={[0.16, 0.16, 0.02]} />
              <meshStandardMaterial color={WindowsColors.progressFill} roughness={0.4} metalness={0.5} />
            </mesh>
          );
        })}
      </group>

      {/* Cancel Button */}
      <group position={[2.2, -1.0, 0.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.3, 0.05]} />
          <meshStandardMaterial color={WindowsColors.bg} roughness={0.8} metalness={0.2} />
        </mesh>
        {/* Button Borders */}
        <mesh position={[-0.49, 0, 0.035]}>
          <boxGeometry args={[0.02, 0.28, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>
        <mesh position={[0, 0.14, 0.035]}>
          <boxGeometry args={[0.98, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderLight} />
        </mesh>
        <mesh position={[0.49, 0, 0.035]}>
          <boxGeometry args={[0.02, 0.28, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDarker} />
        </mesh>
        <mesh position={[0, -0.14, 0.035]}>
          <boxGeometry args={[0.98, 0.02, 0.01]} />
          <meshBasicMaterial color={WindowsColors.borderDarker} />
        </mesh>
        <Text
          position={[0, 0, 0.04]}
          fontSize={0.12}
          color={WindowsColors.text}
          anchorX="center"
          anchorY="middle"
        >
          Cancel
        </Text>
      </group>
    </group>
  );
}

function CameraController({ mode }: { mode: number }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const userInteracting = useRef(false);
  const autoCycleIndex = useRef(1);
  const autoTimer = useRef(0);
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 8.5), []);

  useEffect(() => {
    userInteracting.current = false;
  }, [mode]);

  useFrame((state, delta) => {
    if (userInteracting.current) return;

    let activeMode = mode;

    if (mode === 0) {
      autoTimer.current += delta;
      if (autoTimer.current > 5) {
        autoTimer.current = 0;
        autoCycleIndex.current = (autoCycleIndex.current % 9) + 1;
      }
      activeMode = autoCycleIndex.current;
    }

    const t = state.clock.elapsedTime;

    switch (activeMode) {
      case 1: targetPos.set(0, 0, 8.5); break; // Front
      case 2: targetPos.set(-7, 3, 6); break; // Left angled
      case 3: targetPos.set(7, 4, 6); break; // Right angled
      case 4: targetPos.set(0, 7, 3); break; // Top angled
      case 5: targetPos.set(-4, -1.5, 4.5); break; // Low angle
      case 6: // Orbit slowly
        targetPos.set(Math.sin(t * 0.15) * 8.5, 3, Math.cos(t * 0.15) * 8.5);
        break;
      case 7: // Pan back and forth
        targetPos.set(Math.sin(t * 0.25) * 5, 0, 8.5);
        break;
      case 8: // Dolly in and out
        targetPos.set(0, 1.5, 6 + Math.sin(t * 0.2) * 4);
        break;
      case 9: // Dynamic sweeping arc
        targetPos.set(Math.sin(t * 0.2) * 7, Math.cos(t * 0.125) * 4, 4.5 + Math.sin(t * 0.15) * 4);
        break;
      default:
        targetPos.set(0, 0, 8.5);
    }

    // Smooth ease towards the target position
    camera.position.lerp(targetPos, delta * 1.2);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), delta * 1.5);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef} 
      makeDefault 
      onStart={() => { userInteracting.current = true; }}
    />
  );
}

function Taskbar({ onStartClick }: { onStartClick: () => void }) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const mins = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + mins + ' ' + ampm;
  };

  return (
    <div className="h-[38px] bg-[#c0c7c8] w-full flex justify-between items-center px-1 border-t-2 border-t-white z-50 relative shrink-0">
      <div className="flex items-center gap-1 h-full py-1">
        {/* Start Button */}
        <button 
          onClick={onStartClick}
          className="h-full px-[10px] flex items-center gap-1 bg-[#c0c7c8] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white font-bold text-[17px] text-black"
          style={{ fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", "Microsoft Sans Serif", Tahoma, Arial, sans-serif', WebkitFontSmoothing: 'none' }}
        >
          <div className="grid grid-cols-2 gap-[1px] w-[17px] h-[17px] mr-1 skew-y-[-10deg] skew-x-[-10deg]">
            <div className="bg-[#f05129]"></div>
            <div className="bg-[#7ebc13]"></div>
            <div className="bg-[#00a3f4]"></div>
            <div className="bg-[#ffba00]"></div>
          </div>
          Start
        </button>

        {/* Quick Launch Bar */}
        <div className="flex items-center gap-1 px-1 border-l border-l-white border-r border-r-[#808080] h-full mx-1">
          <a href="https://itsjaydesu.com" target="_blank" rel="noopener noreferrer" className="w-[29px] h-[29px] flex items-center justify-center hover:bg-[#c0c7c8] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white border-2 border-transparent" title="Internet Explorer">
            <Globe size={19} className="text-blue-600" />
          </a>
          <a href="https://x.com/itsjaydesu" target="_blank" rel="noopener noreferrer" className="w-[29px] h-[29px] flex items-center justify-center hover:bg-[#c0c7c8] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white border-2 border-transparent" title="X.com">
            <span className="font-bold text-black text-[17px] leading-none">X</span>
          </a>
          <a href="https://github.com/itsjaydesu" target="_blank" rel="noopener noreferrer" className="w-[29px] h-[29px] flex items-center justify-center hover:bg-[#c0c7c8] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white border-2 border-transparent" title="GitHub">
            <Github size={19} className="text-black" />
          </a>
        </div>
      </div>

      {/* Tray */}
      <div 
        className="h-[29px] px-[10px] flex items-center justify-center min-w-[84px] bg-[#c0c7c8] border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white text-[14px] text-black"
        style={{ fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", "Microsoft Sans Serif", Tahoma, Arial, sans-serif', WebkitFontSmoothing: 'none' }}
      >
        {mounted ? formatTime(time) : ''}
      </div>
    </div>
  );
}

export default function App() {
  const [cameraMode, setCameraMode] = useState(1);

  return (
    <div className="w-full h-[100dvh] bg-[#018081] flex flex-col overflow-hidden font-sans">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 8.5], fov: 50 }} shadows>
          <Suspense fallback={<Html center><div className="text-white text-xl font-bold whitespace-nowrap">Loading 3D Scene...</div></Html>}>
            <ambientLight intensity={0.25} />
            
            {/* Main Key Light */}
            <spotLight 
              position={[6, 8, 4]} 
              intensity={1.8} 
              angle={0.8}
              penumbra={1}
              castShadow 
              shadow-mapSize-width={4096} 
              shadow-mapSize-height={4096}
              shadow-bias={-0.0001}
              shadow-radius={4}
              color="#fff5e6"
            />
            
            {/* Fill Light */}
            <directionalLight position={[-5, 3, 5]} intensity={0.4} color="#e6f0ff" />
            
            {/* Rim Light for dramatic edge highlights */}
            <spotLight 
              position={[0, 6, -5]} 
              intensity={2} 
              angle={1}
              penumbra={1}
              color="#ffe6cc"
            />

            <CameraController mode={cameraMode} />
            
            <group rotation={[0, 0, 0]}>
              <Dialog delayTimeMs={1400} />
            </group>

            <Environment preset="studio" />
            <color attach="background" args={['#018081']} />
          </Suspense>
        </Canvas>
      </div>
      <Taskbar onStartClick={() => setCameraMode(prev => (prev % 9) + 1)} />
    </div>
  );
}
