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
                    height: '100%'
                }}
            >
                <ShaderGradient
                    control='query'
                    urlString='https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%236b5b95&color2=%23fc8dc7&color3=%23ffbd84&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=1.3&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false'
                />
            </ShaderGradientCanvas>
        </div>
    );
}
