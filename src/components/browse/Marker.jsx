/* eslint-disable react/no-unknown-property */

"use client";

import { useGLTF } from "@react-three/drei";

export default function Marker(props) {
  const { nodes, materials } = useGLTF("/marker.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials["Material.001"]}
        scale={3}
      />
    </group>
  );
}

useGLTF.preload("/marker.gltf");
