"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";

export default function ShaderPlane({ bounds, position, rotation, scale }) {
  const shaderRef = useRef();

  const maskTexture = useLoader(
    THREE.TextureLoader,
    "/textures/map-mask-1.png"
  );
  maskTexture.wrapS = maskTexture.wrapT = THREE.ClampToEdgeWrapping;

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.iTime.value = clock.getElapsedTime();
    }
  });

  if (!bounds) return null;

  const { size } = bounds;

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float iTime;
        uniform sampler2D mask;

        #define BLADES_SPACING 0.004
        #define JITTER_MAX 0.004
        #define LOOKUP_DIST 5
        #define HASHSCALE1 .1031
        #define HASHSCALE3 vec3(.1031, .1030, .0973)
        #define PI 3.14

        float hash12(vec2 p) {
          vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
          p3 += dot(p3, p3.yzx + 19.19);
          return fract((p3.x + p3.y) * p3.z);
        }

        vec3 hash32(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
          p3 += dot(p3, p3.yxz + 19.19);
          return fract((p3.xxy + p3.yzz) * p3.zyx);
        }

        vec2 hash22(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
          p3 += dot(p3, p3.yzx + 19.19);
          return fract((p3.xx + p3.yz) * p3.zy);
        }

vec3 getGrassColor(float x) {
  float variation = sin(x * 6.283 + iTime * 0.5) * 0.05;
  return vec3(0.38 + variation, 0.65 + variation, 0.28 + variation);
}

        float getGrassBlade(in vec2 position, in vec2 grassPos, out vec4 color) {
          vec3 grassVector3 = hash32(grassPos * 123512.41) * 2.0 - vec3(1);
          grassVector3.x += 0.2 * sin(iTime * 2.0 + grassPos.x * 100.0);
          grassVector3.z = grassVector3.z * 0.2 + 0.2;
          vec2 grassVector2 = normalize(grassVector3.xy);

          float grassLength = hash12(grassPos * 102348.7) * 0.01 + 0.012;
          vec2 gv = position - grassPos;
          float gx = dot(grassVector2, gv);
          float gy = dot(vec2(-grassVector2.y, grassVector2.x), gv);
          float gxn = gx / grassLength;

          if (gxn >= 0.0 && gxn <= 1.0 && abs(gy) <= 0.0008 * (1. - gxn * gxn)) {
            vec3 thisGrassColor = getGrassColor(hash12(grassPos * 2631.6));
          color = vec4(thisGrassColor * (0.8 + 0.6 * gxn), 1.0);
            return grassVector3.z * gxn;
          } else {
            color = vec4(0.);
            return -1.0;
          }
        }

        float getPoint(in vec2 position, out vec4 color) {
          int xcount = int(1. / BLADES_SPACING);
          int ycount = int(1. / BLADES_SPACING);
          int ox = int(position.x * float(xcount));
          int oy = int(position.y * float(ycount));

          float maxz = 0.0;

          for (int i = -LOOKUP_DIST; i < LOOKUP_DIST; ++i) {
            for (int j = -LOOKUP_DIST; j < LOOKUP_DIST; ++j) {
              vec2 upos = vec2(ox + i, oy + j);
              vec2 grassPos = (upos * BLADES_SPACING + hash22(upos) * JITTER_MAX);

              vec4 tempColor;
              float z = getGrassBlade(position, grassPos, tempColor);

              if (z > maxz) {
                maxz = z;
                color = tempColor;
              }
            }
          }

        if (maxz == 0.0) color = vec4(0., 0., 0., 0.);
          return maxz;
        }

        void main() {
          float alpha = texture2D(mask, vUv).r;
          if (alpha < 0.1) discard;

         vec2 uv = fract(vUv * 10.0);
          vec4 color;
          getPoint(uv, color);
         gl_FragColor = vec4(color.rgb, color.a * alpha);
          
        }
      `,
      uniforms: {
        iTime: { value: 0 },
        mask: { value: maskTexture },
      },
      transparent: true,
    });
  }, [maskTexture]);

  return (
    <mesh
      position={[279.5, 15.3, 185]}
      rotation={[-Math.PI / 2, 0, Math.PI / 1.866]}
      scale={[1.045, 0.7829, 1]}
    >
      <planeGeometry args={[size.x, size.z]} />
      <primitive object={shaderMaterial} ref={shaderRef} attach="material" />
    </mesh>
  );
}
