// @ts-check

"use client";

import * as THREE from "three";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from "@react-three/drei";

export default function ThreejsScene() {
  const uniforms = {
    colorA: { type: 'vec3', value: new THREE.Color("red") },
    colorB: { type: 'vec3', value: new THREE.Color("blue") },
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
      float factor = vUv.z + 0.5;
      gl_FragColor = vec4(mix(colorA, colorB, factor), 1.0);
    }
  `;

  return (
    <Canvas style={{ background: "black" }}>
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
      <axesHelper />
    </Canvas>
  );
}
