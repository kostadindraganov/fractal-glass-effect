'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

export interface GlassEffectConfig {
  lerpFactor?: number;
  parallaxStrength?: number;
  distortionMultiplier?: number;
  glassStrength?: number;
  glassSmoothness?: number;
  stripesFrequency?: number;
  edgePadding?: number;
}

export interface GlassEffectProps {
  imageSrc: string;
  config?: GlassEffectConfig;
  className?: string;
  children?: React.ReactNode;
}

const defaultConfig: Required<GlassEffectConfig> = {
  lerpFactor: 0.035,
  parallaxStrength: 0.1,
  distortionMultiplier: 10,
  glassStrength: 2.0,
  glassSmoothness: 0.0001,
  stripesFrequency: 35,
  edgePadding: 0.1,
};

export default function GlassEffect({
  imageSrc,
  config: userConfig = {},
  className = '',
  children,
}: GlassEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const config = { ...defaultConfig, ...userConfig };
    const container = containerRef.current;
    const imageElement = imageRef.current;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const mouse = mouseRef.current;
    const targetMouse = targetMouseRef.current;

    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const textureSize = { x: 1, y: 1 };
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTextureSize: {
          value: new THREE.Vector2(textureSize.x, textureSize.y),
        },
        uMouse: { value: new THREE.Vector2(mouse.x, mouse.y) },
        uParallaxStrength: { value: config.parallaxStrength },
        uDistortionMultiplier: { value: config.distortionMultiplier },
        uGlassStrength: { value: config.glassStrength },
        ustripesFrequency: { value: config.stripesFrequency },
        uglassSmoothness: { value: config.glassSmoothness },
        uEdgePadding: { value: config.edgePadding },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Load texture from image element
    function loadImageFromElement() {
      if (!imageElement.complete) {
        imageElement.onload = loadImageFromElement;
        return;
      }

      const texture = new THREE.Texture(imageElement);
      textureSize.x = imageElement.naturalWidth || imageElement.width;
      textureSize.y = imageElement.naturalHeight || imageElement.height;

      texture.needsUpdate = true;
      material.uniforms.uTexture.value = texture;
      material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y);
    }

    if (imageElement.complete) {
      loadImageFromElement();
    } else {
      imageElement.onload = loadImageFromElement;
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    };

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      mouse.x = lerp(mouse.x, targetMouse.x, config.lerpFactor);
      mouse.y = lerp(mouse.y, targetMouse.y, config.lerpFactor);
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      if (materialRef.current) {
        materialRef.current.dispose();
      }

      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [imageSrc, userConfig]);

  return (
    <section className={`glass-effect-container ${className}`} ref={containerRef}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Glass Effect Texture"
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
      {children && <div className="glass-effect-content">{children}</div>}
    </section>
  );
}
