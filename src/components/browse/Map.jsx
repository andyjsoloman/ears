"use client";
import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ShaderPlane from "./ShaderPlane";

export default function Map(props) {
  const { nodes } = useGLTF("/map.gltf");
  const meshRef = useRef();
  const [bounds, setBounds] = useState(null);

  const position = [-100, -5, 750];
  const rotation = [Math.PI / 2, 0, 4.6];
  const scale = 2;

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(meshRef.current);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      setBounds({ size, center });
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
        position={position}
        rotation={rotation}
        scale={scale}
      />
      {bounds && (
        <>
          <ShaderPlane
            bounds={bounds}
            position={position}
            rotation={rotation}
            scale={scale}
          />
        </>
      )}
    </group>
  );
}

useGLTF.preload("/map.gltf");
