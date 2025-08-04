// @ts-check

"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Cube() {
  const uniforms = {
    uColorA: { value: new THREE.Color("red") },
    uColorB: { value: new THREE.Color("blue") },
    uTime: { value: 0 },
  };

  const vertexShader = `
    varying vec3 vUv; 

    void main() {
      vUv = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorA; 
    uniform vec3 uColorB; 
    uniform float uTime;
    
    varying vec3 vUv;

    void main() {
      float timeFactor = vUv.z + 0.5 + sin(uTime) * 0.5;
      vec3 color = mix(uColorA, uColorB, timeFactor);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const shaderRef = useRef(null);

  useFrame(state => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={uniforms}
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
