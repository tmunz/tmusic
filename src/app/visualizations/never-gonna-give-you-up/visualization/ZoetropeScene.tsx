import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { LinearFilter, TextureLoader } from 'three';
import { useRef, useState, useCallback, useEffect } from 'react';
import { interpolation } from '../../../utils/ShaderUtils';
import { RootState } from '@react-three/fiber';
import { useRecordPlayerArm } from './useRecordPlayerArm';

export interface ZoetropeSzeneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  dataStartAngle?: number;
  dataRatio?: number;
  stroboscopicEffect?: number;
  stroboscopicAngle?: number;
  imageUrl: string;
  recordPlayerOpacity?: number;
  recordPlayerArmSpeed?: number;
  onRecordFinished?: () => void;
}

export const ZoetropeSzene = ({
  width,
  height,
  sampleProvider,
  dataStartAngle = 0,
  dataRatio = 1.0,
  stroboscopicEffect = 0,
  stroboscopicAngle = 6,
  imageUrl,
  recordPlayerOpacity = 0.8,
  recordPlayerArmSpeed = 1.0,
  onRecordFinished,
}: ZoetropeSzeneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const recordRotationRef = useRef(0);
  const lastElapsedTimeRef = useRef(0);
  const updateArmRotation = useRecordPlayerArm(sampleProvider, recordPlayerArmSpeed, onRecordFinished);

  const [recordPlayerSize, setRecordPlayerSize] = useState({ x: 2, y: 1 });

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(require('./braun-sk-61-main.png'), texture => {
      setRecordPlayerSize({ x: texture.image.width, y: texture.image.height });
    });
  }, []);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCenter, setZoomCenter] = useState({ x: 0.5, y: 0.5 });
  const [hoverPos, setHoverPos] = useState({ x: 0.5, y: 0.5 });
  const [animatedZoomFactor, setAnimatedZoomFactor] = useState(0);
  const zoomAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = animatedZoomFactor;
    const targetValue = isZoomed ? 1.0 : 0.0;

    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);
      const easedProgress =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newValue = startValue + (targetValue - startValue) * easedProgress;
      setAnimatedZoomFactor(newValue);

      if (progress < 1.0) {
        zoomAnimationRef.current = requestAnimationFrame(animate);
      } else {
        zoomAnimationRef.current = null;
      }
    };

    zoomAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (zoomAnimationRef.current !== null) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, [isZoomed]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    setHoverPos({ x, y });
  }, []);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = 1 - (event.clientY - rect.top) / rect.height;
        setZoomCenter({ x, y });
      }
      setIsZoomed(!isZoomed);
    },
    [isZoomed]
  );

  const getUniforms = (rootState: RootState) => {
    updateSampleTexture();
    const elapsedTime = rootState.clock.getElapsedTime();
    const deltaTime = elapsedTime - lastElapsedTimeRef.current;
    lastElapsedTimeRef.current = elapsedTime;

    const armRotation = updateArmRotation(elapsedTime, deltaTime);

    const hz = sampleProvider.hz;
    if (hz > 0) {
      recordRotationRef.current -= 2 * Math.PI * hz * deltaTime;
    }

    let displayRotation = recordRotationRef.current;
    if (stroboscopicEffect > 0) {
      const frameSize = (stroboscopicAngle * Math.PI) / 180;
      const discreteRotation = Math.round(recordRotationRef.current / frameSize) * frameSize;
      displayRotation = recordRotationRef.current * (1 - stroboscopicEffect) + discreteRotation * stroboscopicEffect;
    }

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      sampleProviderHz: { value: sampleProvider.hz },
      sampleProviderActive: { value: sampleProvider.active ? 1 : 0 },
      rotation: { value: displayRotation },
      dataStartAngle: { value: (dataStartAngle * Math.PI) / 180 },
      dataRatio: { value: dataRatio },
      zoomFactor: { value: animatedZoomFactor },
      zoomCenter: { value: { x: zoomCenter.x, y: zoomCenter.y } },
      zoomMagnification: { value: 6.0 },
      indicatorPos: { value: { x: hoverPos.x, y: hoverPos.y } },
      resolution: { value: { x: width, y: height } },
      recordPlayerOpacity: { value: recordPlayerOpacity },
      recordPlayerSize: { value: recordPlayerSize },
      armRotation: { value: armRotation },
    };
  };

  return (
    <div onClick={handleClick} onMouseMove={handleMouseMove} style={{ cursor: 'pointer', width, height }}>
      <ShaderImage
        imageUrls={{
          image: imageUrl,
          recordPlayerMain: require('./braun-sk-61-main.png'),
          recordPlayerArm: require('./braun-sk-61-arm.png'),
          recordPlayerRpm: require('./braun-sk-61-rpm.png'),
          recordPlayerPower: require('./braun-sk-61-power.png'),
        }}
        objectFit="fill"
        width={width}
        height={height}
        getUniforms={getUniforms}
        imageFilter={LinearFilter}
        vertexShader={`
        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;
        
        void main() {
          vUv = uv;
          vSize = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
          vPosition = vec2(position + 0.5) * vSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
        fragmentShader={`
        precision mediump float;
        varying vec2 vUv;
        varying vec2 vPosition;
        varying vec2 vSize;

        uniform sampler2D image;
        uniform sampler2D sampleData;
        uniform vec2 sampleDataSize;
        uniform float sampleProviderHz;
        uniform float sampleProviderActive;
        uniform float rotation;
        uniform float dataStartAngle;
        uniform float dataRatio;
        uniform float zoomFactor;
        uniform vec2 zoomCenter;
        uniform float zoomMagnification;
        uniform vec2 indicatorPos;
        uniform vec2 resolution;
        uniform float recordPlayerOpacity;
        uniform sampler2D recordPlayerMain;
        uniform sampler2D recordPlayerArm;
        uniform sampler2D recordPlayerRpm;
        uniform sampler2D recordPlayerPower;
        uniform vec2 recordPlayerSize;
        uniform float armRotation;

        vec4 dataColor = vec4(1.);
        float pinRadius = 0.012;
        float innerDataRadius = 0.14;
        float outerDataRadius = 0.48;
        float outerRadius = 0.495;
        float sa = 0.001; // smoothstep distance for anti-aliasing

        ${interpolation}

        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, -s, s, c);
          return m * v;
        }

        bool isOnIndicatorBorder(vec2 uv, vec2 indicatorPos, vec2 zoomSize, vec2 resolution) {
          vec2 indicatorMin = indicatorPos - zoomSize * 0.5;
          vec2 indicatorMax = indicatorPos + zoomSize * 0.5;
          
          vec2 distToMin = abs(uv - indicatorMin);
          vec2 distToMax = abs(uv - indicatorMax);
          vec2 borderThickness = 1.0 / resolution;
          
          bool onLeftEdge = distToMin.x < borderThickness.x && uv.y >= indicatorMin.y && uv.y <= indicatorMax.y;
          bool onRightEdge = distToMax.x < borderThickness.x && uv.y >= indicatorMin.y && uv.y <= indicatorMax.y;
          bool onBottomEdge = distToMin.y < borderThickness.y && uv.x >= indicatorMin.x && uv.x <= indicatorMax.x;
          bool onTopEdge = distToMax.y < borderThickness.y && uv.x >= indicatorMin.x && uv.x <= indicatorMax.x;
          
          return onLeftEdge || onRightEdge || onBottomEdge || onTopEdge;
        }

        void main() {
          const float PI = 3.14159265;

          // zooming
          const float initialZoom = 0.9;
          vec2 uvInitial = (vUv - 0.5) / initialZoom + 0.5;
          float zoomSize = 1.0 / zoomMagnification;
          vec2 uvZoomed = zoomCenter + (vUv - 0.5) * zoomSize / initialZoom;
          vec2 uv = mix(uvInitial, uvZoomed, zoomFactor);
          vec2 borderSize = 1.0 / resolution;
          vec2 distFromEdge = min(vUv, 1.0 - vUv);
          float border = step(distFromEdge.x, borderSize.x) + step(distFromEdge.y, borderSize.y);
          float aspectRatio = vSize.x / vSize.y;

          // aspect ratio correction
          if (aspectRatio > 1.0) {
            uv.x = (uv.x - 0.5) * aspectRatio + 0.5;
          } else {
            uv.y = (uv.y - 0.5) / aspectRatio + 0.5;
          }

          // record player
          float recordPlayerAspect = recordPlayerSize.x / recordPlayerSize.y;
          vec2 recordPlayerUv = (uv * vec2(1.0, recordPlayerAspect) + vec2(-0.121, -0.175)) * 0.62;
          vec4 color = mix(vec4(0.9, 0.9, 0.9, 0.0), texture2D(recordPlayerMain, recordPlayerUv), recordPlayerOpacity);
          vec4 recordPlayerPower = texture2D(recordPlayerPower, vec2(recordPlayerUv.x, recordPlayerUv.y + smoothstep(0.1, 0.9, sampleProviderActive) * 0.048));
          color = mix(color, recordPlayerPower, recordPlayerOpacity * recordPlayerPower.a);
          vec4 recordPlayerRpm = texture2D(recordPlayerRpm, vec2(recordPlayerUv.x, recordPlayerUv.y - 0.008 + smoothstep(16., 78., 75. * sampleProviderHz) * 0.12));
          color = mix(color, recordPlayerRpm, recordPlayerOpacity * recordPlayerRpm.a);

          // record and data visualization
          vec2 center = vec2(0.5, 0.5);
          vec2 fromCenter = uv - center;
          float dist = length(fromCenter);
          float angle = atan(fromCenter.y, fromCenter.x);
          
          float normalizedAngle = (angle + PI * 0.5 + dataStartAngle) / (2.0 * PI);
          normalizedAngle = mod(normalizedAngle, 1.0);
          vec2 rotatedFromCenter = rotate(fromCenter, rotation);
          vec2 rotatedUv = rotatedFromCenter + center;
          vec4 pictureDiscColor = texture2D(image, rotatedUv);
          pictureDiscColor.a = smoothstep(pinRadius, pinRadius + sa, dist) * smoothstep(outerRadius, outerRadius - sa, dist);
          color = mix(color, pictureDiscColor, pictureDiscColor.a);
          
          float frequencyIndex = normalizedAngle;
          float radialPos = (dist - innerDataRadius) / (outerDataRadius - innerDataRadius);
          float sampleValue = interpolation(sampleData, vec2(radialPos, 1.0 - frequencyIndex), sampleDataSize, vec2(0., 1.)).r;
          dataColor.a = smoothstep(outerDataRadius, outerDataRadius - sa, dist);
          float dataArea = smoothstep(innerDataRadius, innerDataRadius + sa, dist) * smoothstep(outerDataRadius, outerDataRadius - sa, dist);
          color = mix(color, dataColor, dataArea * dataRatio * sampleValue);

          // zoom indicator
          vec2 adjustedIndicatorPos = indicatorPos;
          vec2 adjustedZoomSize = vec2(zoomSize);
          if (aspectRatio > 1.0) {
            adjustedIndicatorPos.x = (adjustedIndicatorPos.x - 0.5) * aspectRatio + 0.5;
            adjustedZoomSize.x = zoomSize * aspectRatio;
          } else {
            adjustedIndicatorPos.y = (adjustedIndicatorPos.y - 0.5) / aspectRatio + 0.5;
            adjustedZoomSize.y = zoomSize / aspectRatio;
          }
          if (isOnIndicatorBorder(uv, adjustedIndicatorPos, adjustedZoomSize, resolution)) {
            color = mix(color, vec4(1.0, 1.0, 1.0, 1.0), 0.5 - zoomFactor * 0.5);
          }

          // record player arm
          vec2 armPivot = vec2(1.0, 0.77);
          vec2 armUvBase = uv - armPivot;
          armUvBase = rotate(armUvBase, armRotation);
          armUvBase = armUvBase + armPivot;
          vec2 armUv = (armUvBase * vec2(1.0, recordPlayerAspect) + vec2(-0.121, -0.175)) * 0.62;
          vec4 armColor = texture2D(recordPlayerArm, armUv);
          color = mix(color, armColor, armColor.a * recordPlayerOpacity);
          
          // final color output
          gl_FragColor = color;
        }`}
      />
    </div>
  );
};
