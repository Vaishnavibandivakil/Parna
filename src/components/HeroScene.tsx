import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, type Mesh, type ShaderMaterial } from 'three';
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  return [parseInt(value.slice(0, 2), 16) / 255, parseInt(value.slice(2, 4), 16) / 255, parseInt(value.slice(4, 6), 16) / 255];
};

const vertexShader = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader = `varying vec2 vUv;uniform float uTime;uniform vec3 uColor;uniform float uSpeed;uniform float uScale;uniform float uRotation;uniform float uNoiseIntensity;const float e=2.71828182845904523536;float noise(vec2 t){vec2 r=e*sin(e*t);return fract(r.x*r.y*(1.0+t.x));}vec2 rotateUvs(vec2 uv,float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c)*uv;}void main(){float rnd=noise(gl_FragCoord.xy);vec2 tex=rotateUvs(vUv*uScale,uRotation)*uScale;float t=uSpeed*uTime;tex.y+=.03*sin(8.0*tex.x-t);float pattern=.6+.4*sin(5.0*(tex.x+tex.y+cos(3.0*tex.x+5.0*tex.y)+.02*t)+sin(20.0*(tex.x+tex.y-.1*t)));float grain=rnd/15.0*uNoiseIntensity;gl_FragColor=vec4(clamp(uColor*pattern-vec3(grain),0.0,1.0),1.0);}`;

type Uniforms = { uTime: { value: number }; uColor: { value: Color }; uSpeed: { value: number }; uScale: { value: number }; uRotation: { value: number }; uNoiseIntensity: { value: number } };
const Plane = forwardRef<Mesh, { uniforms: Uniforms }>(function Plane({ uniforms }, ref) {
  const { viewport } = useThree();
  useLayoutEffect(() => { if (ref && typeof ref !== 'function' && ref.current) ref.current.scale.set(viewport.width, viewport.height, 1); }, [ref, viewport]);
  useFrame((_, delta) => { if (ref && typeof ref !== 'function' && ref.current) (ref.current.material as ShaderMaterial).uniforms.uTime.value += delta * 0.1; });
  return <mesh ref={ref}><planeGeometry args={[1, 1]} /><shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} /></mesh>;
});

export function HeroScene() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo<Uniforms>(() => ({ uTime: { value: 0 }, uColor: { value: new Color(...toRgb('#9c660e')) }, uSpeed: { value: 5 }, uScale: { value: 1.1 }, uRotation: { value: .05 }, uNoiseIntensity: { value: 1.5 } }), []);
  useEffect(() => undefined, []);
  return <div id="hero-canvas" aria-hidden="true"><Canvas dpr={[1, 2]} gl={{ alpha: false, antialias: true }}><Plane ref={mesh} uniforms={uniforms} /></Canvas></div>;
}
