'use client';

import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { useTheme } from '@/context/ThemeContext';

export default function BackgroundGradient() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      {/* Overlay */}
      <div
        className={`absolute inset-0 z-10 ${
          isDark ? 'bg-gray-900/40' : 'bg-white/25'
        }`}
      ></div>

      <ShaderGradientCanvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <ShaderGradient
          control="props"
          animate="on"
          brightness={isDark ? 1 : 1.4}

          cAzimuthAngle={180}
          cDistance={2.81}
          cPolarAngle={80}
          cameraZoom={9.1}

          /* theme'e göre renk */
          color1={isDark ? '#2a2a2a' : '#ffffff'}
          color2={isDark ? '#555555' : '#e2e8f0'}
          color3={isDark ? '#7a7a7a' : '#cbd5e1'}

          envPreset="city"
          grain="on"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          reflection={0.15}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.5}
          uFrequency={0}
          uSpeed={0.3}
          uStrength={2.2}
          uTime={8}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}