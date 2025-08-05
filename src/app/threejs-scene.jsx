// @ts-check

"use client";

import * as THREE from "three";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function ThreejsScene() {
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

  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib["fog"],
    {
      uColorA: { value: new THREE.Color("yellow") },
      uColorB: { value: new THREE.Color("hotpink") },
    },
  ]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#333333");
    scene.fog = new THREE.Fog("#333333", 5, 18);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, fog: true });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function rotateCubeRandomly() {
      const randomRotationRad = Math.floor(Math.random() * 360 - 180) * Math.PI / 180;  // [-180, 180]
      const randomAxis = ["x", "y", "z"][Math.floor(Math.random() * 3)];

      gsap.to(cube.rotation, {
        [randomAxis]: randomRotationRad,
      });
    }

    gsap.timeline()
      .to(cube.position, { x: 5, z: 0, ease: "none" })
      .to(cube.position, { x: 5, z: 5, ease: "none" })
      .to(cube.position, { x: 0, z: 5, ease: "none" })
      .to(cube.position, { x: 0, z: 0, ease: "none" })
      .duration(4)
      .repeat(-1);

    return (() => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    });
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
}
