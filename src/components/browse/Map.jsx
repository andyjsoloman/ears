/* eslint-disable react/no-unknown-property */

"use client";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Map(props) {
  const { nodes, materials } = useGLTF("/map.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
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
