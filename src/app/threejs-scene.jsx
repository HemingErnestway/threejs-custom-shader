// @ts-check

"use client";

import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/addons";
import { useEffect, useRef } from "react";

export default function ThreejsScene() {
  const vertexShader = `
    varying vec3 vGlobalPosition;
    
    ${THREE.ShaderChunk["common"]}
    ${THREE.ShaderChunk["fog_pars_vertex"]}

    void main() {
      ${THREE.ShaderChunk["begin_vertex"]}
      ${THREE.ShaderChunk["project_vertex"]}
    
      vGlobalPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      
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
      float x = sin(vGlobalPosition.x) * 0.5 + 0.5;
      float z = sin(vGlobalPosition.z) * 0.5 + 0.5;
      
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

  function rotateMeshRandomly(mesh) {
    const randomRotationRad = Math.floor(Math.random() * 360 - 180) * Math.PI / 180;  // [-180, 180]
    const randomAxis = ["x", "y", "z"][Math.floor(Math.random() * 3)];

    gsap.to(mesh.rotation, {
      [randomAxis]: randomRotationRad,
    });
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#333333");
    scene.fog = new THREE.Fog(0x333333, 5, 18);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(8, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, canvas);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, fog: true });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
      const rect = canvas.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([cube]);

      if (intersects.length > 0) {
        rotateMeshRandomly(cube);
      }
    }

    canvas.addEventListener("click", onClick);

    let requestId;

    function animate() {
      requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    const tl = gsap.timeline();
    tl.to(cube.position, { x: 5, z: 0, ease: "none" })
      .to(cube.position, { x: 5, z: 5, ease: "none" })
      .to(cube.position, { x: 0, z: 5, ease: "none" })
      .to(cube.position, { x: 0, z: 0, ease: "none" })
      .duration(4)
      .repeat(-1);

    return (() => {
      canvas.removeEventListener("click", onClick);
      cancelAnimationFrame(requestId);

      tl.kill();

      controls.dispose();
      geometry.dispose();
      material.dispose();

      scene.remove(axesHelper);
      scene.remove(cube);

      renderer.dispose();
    });
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
}
