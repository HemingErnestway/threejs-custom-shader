// @ts-check

"use client";

import * as THREE from "three";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function ThreejsScene() {
  const uniforms = {
    colorB: { type: 'vec3', value: new THREE.Color(0xACB6E5) },
    colorA: { type: 'vec3', value: new THREE.Color(0x74ebd5) },
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
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
      gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
    }
  `;

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          args={[{
            uniforms: uniforms,
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
          }]}
        />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
