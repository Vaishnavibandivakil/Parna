import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color } from 'three';

const hexToNormalizedRGB = hex => {
  const value = hex.replace('#', '');
  return [parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255];
};

const vertexShader = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime; uniform vec3 uColor; uniform float uSpeed; uniform float uScale; uniform float uRotation; uniform float uNoiseIntensity;
const float e = 2.71828182845904523536;
float noise(vec2 texCoord) { vec2 r = e * sin(e * texCoord); return fract(r.x * r.y * (1.0 + texCoord.x)); }
vec2 rotateUvs(vec2 uv, float angle) { float c = cos(angle); float s = sin(angle); return mat2(c, -s, s, c) * uv; }
void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 tex = rotateUvs(vUv * uScale, uRotation) * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec3 result = uColor * pattern - vec3(rnd / 15.0 * uNoiseIntensity);
  gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
  const { viewport } = useThree();
  useLayoutEffect(() => { ref.current?.scale.set(viewport.width, viewport.height, 1); }, [ref, viewport]);
  useFrame((_, delta) => { ref.current.material.uniforms.uTime.value += 0.1 * delta; });
  return <mesh ref={ref}><planeGeometry args={[1, 1, 1, 1]} /><shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /></mesh>;
});

export function SilkBackground({ speed = 5, scale = 1.1, color = '#9c660e', noiseIntensity = 1.5, rotation = 0.05 }) {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({ uSpeed: { value: speed }, uScale: { value: scale }, uNoiseIntensity: { value: noiseIntensity }, uColor: { value: new Color(...hexToNormalizedRGB(color)) }, uRotation: { value: rotation }, uTime: { value: 0 } }), []);
  useEffect(() => {
    uniforms.uSpeed.value = speed; uniforms.uScale.value = scale; uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uColor.value.setRGB(...hexToNormalizedRGB(color)); uniforms.uRotation.value = rotation;
  }, [speed, scale, color, noiseIntensity, rotation, uniforms]);
  return <Canvas className="!h-full !w-full" dpr={[1, 2]} frameloop="always" gl={{ alpha: false, antialias: true }}><SilkPlane ref={meshRef} uniforms={uniforms} /></Canvas>;
}
