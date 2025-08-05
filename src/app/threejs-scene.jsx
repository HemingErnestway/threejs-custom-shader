// @ts-check

"use client";

import gsap from "gsap";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Cube() {
  const vertexShader = `
    varying vec3 vGlobalPosition;
    
    ${THREE.ShaderChunk["common"]}
    ${THREE.ShaderChunk["fog_pars_vertex"]}

    void main() {
      ${THREE.ShaderChunk["begin_vertex"]}
      ${THREE.ShaderChunk["project_vertex"]}
    
      vec4 globalPosition = modelMatrix * vec4(position, 1.0);
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      
      vGlobalPosition = globalPosition.xyz;
      gl_Position = projectionMatrix * modelViewPosition; 
      
      ${THREE.ShaderChunk["fog_vertex"]}
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
  
    varying vec3 vGlobalPosition;
    
    ${THREE.ShaderChunk["common"]}
    ${THREE.ShaderChunk["fog_pars_fragment"]}
    
    void main() {
      float x = sin(vGlobalPosition.x);
      float z = cos(vGlobalPosition.z);
      
      gl_FragColor = vec4(mix(uColorA, uColorB, x + z), 1.0);
      
      ${THREE.ShaderChunk["fog_fragment"]}
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

  function rotateRandomly() {
    const randomRotationRad = Math.floor(Math.random() * 360 - 180) * Math.PI / 180;  // [-180, 180]
    const randomAxis = ["x", "y", "z"][Math.floor(Math.random() * 3)];

    gsap.to(cubeRef.current.rotation, {
      [randomAxis]: randomRotationRad,
    });
  }

  return (
    <mesh
      ref={cubeRef}
      onClick={rotateRandomly}
    >
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        uniforms={THREE.UniformsUtils.merge([
          THREE.UniformsLib["fog"],
          {
            uColorA: { value: new THREE.Color("yellow") },
            uColorB: { value: new THREE.Color("hotpink") },
          },
        ])}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        fog={false}
      />
    </mesh>
  );
}

export default function ThreejsScene() {
  return (
    <Canvas style={{ background: "#333333" }}>
      <Cube />
      <OrbitControls />
      <fog attach="fog" args={[0x333333, 10, 15]}/>
      <axesHelper />
    </Canvas>
  );
}
