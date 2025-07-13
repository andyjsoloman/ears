export default function topShader(mesh) {
  const geom = mesh.geometry.clone();
  geom.computeVertexNormals(); // just in case

  const pos = geom.attributes.position;
  const norm = geom.attributes.normal;
  const index = geom.index;

  const topPositions = [];
  const topIndices = [];

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);

    const na = new THREE.Vector3(norm.getX(a), norm.getY(a), norm.getZ(a));
    const nb = new THREE.Vector3(norm.getX(b), norm.getY(b), norm.getZ(b));
    const nc = new THREE.Vector3(norm.getX(c), norm.getY(c), norm.getZ(c));

    const faceNormal = na.clone().add(nb).add(nc).normalize();

    // Filter faces that point mostly up
    if (faceNormal.z > 0.95) {
      // Push positions into new array
      [a, b, c].forEach((idx) => {
        topPositions.push(pos.getX(idx), pos.getY(idx), pos.getZ(idx));
        topIndices.push(topIndices.length);
      });
    }
  }

  if (topPositions.length === 0) return null;

  const topGeometry = new THREE.BufferGeometry();
  topGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(topPositions, 3)
  );
  topGeometry.setIndex(topIndices);
  topGeometry.computeBoundingBox();
  topGeometry.computeVertexNormals();

  // Project UVs for the top face (XY plane)
  const bbox = topGeometry.boundingBox;
  const uv = [];
  for (let i = 0; i < topPositions.length; i += 3) {
    const x = topPositions[i];
    const y = topPositions[i + 1];
    uv.push(
      (x - bbox.min.x) / (bbox.max.x - bbox.min.x),
      (y - bbox.min.y) / (bbox.max.y - bbox.min.y)
    );
  }
  topGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));

  const shaderMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tex;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(tex, vUv);
        if (color.a < 0.1) discard;
        gl_FragColor = color;
      }
    `,
    uniforms: {
      tex: {
        value: new THREE.TextureLoader().load("/textures/yourTexture.png"),
      },
    },
    transparent: true,
  });

  return new THREE.Mesh(topGeometry, shaderMat);
}
