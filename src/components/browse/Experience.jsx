/* eslint-disable react/no-unknown-property */

"use client";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { MapControls } from "three/addons/controls/MapControls.js";

import Ocean from "./Ocean";

import Map from "./Map";
import Marker from "./Marker";

function Experience() {
  const { scene, camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x0487e2, 0.0002);

    camera.near = 1;
    camera.far = 5000;
    camera.position.set(1000, 500, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Initialize MapControls
    controls.current = new MapControls(camera, gl.domElement);
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.1;
    controls.current.screenSpacePanning = true; // ✅ Allow free movement (tilt/pan)
    controls.current.enableRotate = true; // ✅ Enable rotation
    controls.current.rotateSpeed = 1.0; // ✅ Adjust rotation speed
    controls.current.panSpeed = 1.0; // ✅ Adjust panning speed
    controls.current.zoomSpeed = 1.2;
    controls.current.minDistance = 10;
    controls.current.maxDistance = 2000;
    controls.current.maxPolarAngle = Math.PI; // ✅ Allows full tilt (180 degrees)
    controls.current.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE, // ✅ Middle mouse rotates
      RIGHT: THREE.MOUSE.DOLLY, // ✅ Right mouse zooms
    };
    controls.current.target.set(0, 70, 0);
    controls.current.update();

    return () => {
      controls.current.dispose();
    };
  }, [scene, camera, gl]);

  // Update the controls on every frame
  useFrame(() => controls.current?.update());

  return (
    <>
      <Environment
        background
        files={"./kloppenheim_06_puresky_4k.hdr"}
        rotation={[0, -Math.PI, 0]}
      />

      {/* Lighting */}
      <directionalLight
        intensity={1}
        color={0xffffff}
        position={[5, 10, 5]}
        castShadow
      />
      <hemisphereLight
        skyColor={0x333366}
        groundColor={0x74ccf4}
        intensity={0.5}
      />
      <Ocean />
      {/* <Shader /> */}
      {/* <mesh scale={200} position={[5, -20, 5]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <Map />
      <Marker position={[-50, 40, 700]} />
      <Marker position={[600, 50, -50]} />
      <Marker position={[600, 50, -300]} />
      <Marker position={[700, 50, -200]} />
      <Marker position={[550, 50, -150]} />
    </>
  );
}

export default Experience;
