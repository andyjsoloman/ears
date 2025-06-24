/* eslint-disable react/no-unknown-property */

"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Map(props) {
  const { nodes, materials } = useGLTF("/map.gltf");
  // console.log("bounds", nodes.Map.geometry.boundingBox);

  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      // console.log("Mesh size:", size);
      // console.log("Box min:", box.min);
      // console.log("Box max:", box.max);
    }
  }, []);

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        geometry={nodes.Map.geometry}
        material={new THREE.MeshStandardMaterial({ color: "#4f8d36" })}
        position={[-100, -5, 750]}
        rotation={[Math.PI / 2, 0, 4.6]}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/map.gltf");
