import { useGLTF, Html } from "@react-three/drei";
import { useState } from "react";

export default function Marker({
  info = { title: "Recording", uploader: "Unknown" },
  ...props
}) {
  const { nodes, materials } = useGLTF("/marker.gltf");
  const [hovered, setHovered] = useState(false);

  return (
    <group
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";

        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "default";
        setHovered(false);
      }}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials["Material.001"]}
        scale={3}
      />
      {hovered && (
        <Html distanceFactor={500} position={[0, 20, 0]} center>
          <div
            style={{
              background: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              whiteSpace: "nowrap",
              fontSize: "0.8rem",
            }}
          >
            <strong>{info.title}</strong>
            <br />
            <span style={{ fontStyle: "italic", fontSize: "0.7rem" }}>
              by {info.uploader}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
