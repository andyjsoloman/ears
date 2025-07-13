import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function YellowHouse(props) {
  const { nodes } = useGLTF("/yellowhouse.gltf");

  const groupRef = useRef();

  // Center the geometry
  useEffect(() => {
    if (nodes.yellowhouse?.geometry) {
      nodes.yellowhouse.geometry.computeBoundingBox();
      nodes.yellowhouse.geometry.center();
    }
  }, [nodes]);

  // Animate rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5; // rotate around Y axis
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.yellowhouse.geometry}
        material={new THREE.MeshStandardMaterial({ color: "#FED301" })}
        position={[0, 0, 0]} // <- centered in parent group
        rotation={[Math.PI / 2, 0, 0]} // <- we'll rotate the group instead
        scale={0.05}
      />
    </group>
  );
}

useGLTF.preload("/yellowhouse.gltf");
