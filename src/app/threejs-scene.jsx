// @ts-check

"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Cube() {
  const vertexShader = `
    varying vec3 vGlobalPosition;

    void main() {
      vec4 globalPosition = modelMatrix * vec4(position, 1.0);
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      
      vGlobalPosition = globalPosition.xyz;
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;

  const fragmentShader = `
    varying vec3 vGlobalPosition;
    
    void main() {
      float r = (vGlobalPosition.x + 0.5) / 5.0;
      float g = 0.0;
      float b = (vGlobalPosition.z + 0.5) / 5.0;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  const cubeRef = useRef(null);

  useGSAP(() => {
    gsap.timeline()
      .to(cubeRef.current.position, { x: 5, z: 0, ease: "none" })
      .to(cubeRef.current.position, { x: 5, z: 5, ease: "none" })
      .to(cubeRef.current.position, { x: 0, z: 5, ease: "none" })
      .to(cubeRef.current.position, { x: 0, z: 0, ease: "none" })
      .duration(4)
      .repeat(-1);
  });

  return (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function ThreejsScene() {
  return (
    <Canvas style={{ background: "black" }}>
      <Cube />
      <OrbitControls />
      <axesHelper />
    </Canvas>
  );
}
