/* eslint-disable react/no-unknown-property */

"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { MapControls } from "three/addons/controls/MapControls.js";

import { supabase } from "@/lib/supabaseClient";
import { latLngToMapPosition } from "@/utils/latLngToMapPosition";
import Ocean from "./Ocean";
import { tesMarkerPoints } from "@/constants/testMarkerPoints";

import Map from "./Map";
import Marker from "./Marker";

function Experience() {
  const { scene, camera, gl } = useThree();
  const controls = useRef();
  const [recordingPositions, setRecordingPositions] = useState([]);

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

  // Fetch recordings
  useEffect(() => {
    const fetchRecordings = async () => {
      const { data, error } = await supabase
        .from("recordings")
        .select("id, title, file_url, uploader_name, lat, lng");

      if (error) {
        console.error("Error fetching recordings:", error);
        return;
      }

      const recordingsWithPosition = data.map((rec) => ({
        ...rec,
        position: latLngToMapPosition(rec.lat, rec.lng),
      }));

      setRecordingPositions(recordingsWithPosition);
    };

    fetchRecordings();
  }, []);

  //Test Marker Points
  const testMarkerPositions = tesMarkerPoints.map(([lng, lat]) =>
    latLngToMapPosition(lat, lng)
  );

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
      <axesHelper args={[500]} />
      <mesh position={[0, 20, 0]}>
        <boxGeometry args={[10, 10, 10]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <gridHelper args={[1035, 20, "white", "gray"]} position={[0, 100, 0]} />

      <Ocean />
      {/* <Shader /> */}
      {/* <mesh scale={200} position={[5, -20, 5]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <Map />
      {recordingPositions.map((rec, i) => (
        <Marker
          key={rec.id || i}
          position={rec.position}
          scale={6}
          onClick={() => {
            console.log(rec); // Contains title, file_url, etc.
          }}
        />
      ))}

      {testMarkerPositions.map((pos, i) => (
        <Marker key={`test-${i}`} position={pos} />
      ))}
      <Marker position={[0, 14.7, 0]} />
    </>
  );
}

export default Experience;
