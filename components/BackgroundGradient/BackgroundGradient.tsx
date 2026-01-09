'use client';

import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

export default function BackgroundGradient() {
    return (
        <div className="absolute inset-0 w-full h-full -z-10">
            {/* Stronger overlay in light theme for better text readability */}
            <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/40 z-10"></div>

            <ShaderGradientCanvas
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}
            >
                {/* @ts-ignore */}
                <ShaderGradient
                    control="props"
                    animate="on"
                    brightness={1}
                    cAzimuthAngle={180}
                    cDistance={2.81}
                    cPolarAngle={80}
                    cameraZoom={9.1}
                    color1="#2a2a2a"
                    color2="#555555"
                    color3="#7a7a7a"
                    envPreset="city"
                    grain="on"
                    lightType="3d"
                    positionX={0}
                    positionY={0}
                    positionZ={0}
                    reflection={0.1}
                    rotationX={50}
                    rotationY={0}
                    rotationZ={-60}
                    shader="defaults"
                    type="waterPlane"
                    uAmplitude={0}
                    uDensity={1.5}
                    uFrequency={0}
                    uSpeed={0.3}
                    uStrength={1.5}
                    uTime={8}
                    wireframe={false}
                />
            </ShaderGradientCanvas>
        </div>
    );
}

