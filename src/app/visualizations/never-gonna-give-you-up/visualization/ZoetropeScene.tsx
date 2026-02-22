import { ShaderImage } from '../../../ui/shader-image/ShaderImage';
import { SampleProvider } from '../../../audio/SampleProvider';
import { useSampleProviderTexture } from '../../../audio/useSampleProviderTexture';
import { LinearFilter } from 'three';
import { useRef, useState, useCallback, useEffect } from 'react';
import { interpolation } from '../../../utils/ShaderUtils';

export interface ZoetropeSzeneProps {
  width: number;
  height: number;
  sampleProvider: SampleProvider;
  coverOpacity?: number;
  dataStartAngle?: number;
  dataRatio?: number;
  stroboscopicEffect?: number;
  stroboscopicAngle?: number;
  imageUrl: string;
}

export const ZoetropeSzene = ({
  width,
  height,
  sampleProvider,
  coverOpacity = 0.5,
  dataStartAngle = 0,
  dataRatio = 1.0,
  stroboscopicEffect = 0,
  stroboscopicAngle = 6,
  imageUrl,
}: ZoetropeSzeneProps) => {
  const [sampleTexture, updateSampleTexture] = useSampleProviderTexture(sampleProvider);

  const rotationRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  
  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCenter, setZoomCenter] = useState({ x: 0.5, y: 0.5 });
  const [hoverPos, setHoverPos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
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
      
      // Ease in-out cubic
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
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

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      setZoomCenter({ x, y });
    }
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  const getUniforms = () => {
    updateSampleTexture();

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = now;

    const hz = sampleProvider.hz;
    if (hz > 0) {
      rotationRef.current -= 2 * Math.PI * hz * deltaTime;
    }

    let displayRotation = rotationRef.current;
    if (stroboscopicEffect > 0) {
      const frameSize = (stroboscopicAngle * Math.PI) / 180;
      const discreteRotation = Math.round(rotationRef.current / frameSize) * frameSize;
      displayRotation = rotationRef.current * (1 - stroboscopicEffect) + discreteRotation * stroboscopicEffect;
    }

    return {
      sampleData: { value: sampleTexture },
      sampleDataSize: { value: { x: sampleTexture.image.width, y: sampleTexture.image.height } },
      coverOpacity: { value: coverOpacity },
      rotation: { value: displayRotation },
      dataStartAngle: { value: (dataStartAngle * Math.PI) / 180 },
      dataRatio: { value: dataRatio },
      zoomFactor: { value: animatedZoomFactor },
      zoomCenter: { value: { x: zoomCenter.x, y: zoomCenter.y } },
      zoomMagnification: { value: 6.0 },
      indicatorPos: { value: { x: hoverPos.x, y: hoverPos.y } },
      resolution: { value: { x: width, y: height } },
    };
  };

  return (
    <div 
      onClick={handleClick} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ cursor: 'pointer', width, height }}
    >
      <ShaderImage
        imageUrls={{ image: imageUrl }}
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
        uniform float coverOpacity;
        uniform float rotation;
        uniform float dataStartAngle;
        uniform float dataRatio;
        uniform float zoomFactor;
        uniform vec2 zoomCenter;
        uniform float zoomMagnification;
        uniform vec2 indicatorPos;
        uniform vec2 resolution;

        vec4 dataColor = vec4(1.);
        float innerRadius = 0.15;
        float outerRadius = 0.48;

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
          const float initialZoom = 0.9;
          vec2 uvInitial = (vUv - 0.5) / initialZoom + 0.5;
          float zoomSize = 1.0 / zoomMagnification;
          vec2 uvZoomed = zoomCenter + (vUv - 0.5) * zoomSize / initialZoom;
          vec2 uv = mix(uvInitial, uvZoomed, zoomFactor);
          vec2 borderSize = 1.0 / resolution;
          vec2 distFromEdge = min(vUv, 1.0 - vUv);
          float border = step(distFromEdge.x, borderSize.x) + step(distFromEdge.y, borderSize.y);
          
          float aspectRatio = vSize.x / vSize.y;
          if (aspectRatio > 1.0) {
            uv.x = (uv.x - 0.5) * aspectRatio + 0.5;
          } else {
            uv.y = (uv.y - 0.5) / aspectRatio + 0.5;
          }
          
          vec2 center = vec2(0.5, 0.5);
          vec2 fromCenter = uv - center;
          float dist = length(fromCenter);
          float angle = atan(fromCenter.y, fromCenter.x);
          
          float normalizedAngle = (angle + PI * 0.5 + dataStartAngle) / (2.0 * PI);
          normalizedAngle = mod(normalizedAngle, 1.0);

          vec2 rotatedFromCenter = rotate(fromCenter, rotation);
          vec2 rotatedUv = rotatedFromCenter + center;
          vec4 pictureDiscColor = texture2D(image, rotatedUv);
          pictureDiscColor.a = smoothstep(0.5, 0.49, dist);
          
          float frequencyIndex = normalizedAngle;
          float radialPos = (dist - innerRadius) / (outerRadius - innerRadius);
          float sampleValue = interpolation(sampleData, vec2(radialPos, 1.0 - frequencyIndex), sampleDataSize, vec2(0., 1.)).r;
          dataColor.a = smoothstep(outerRadius, outerRadius - 0.01, dist);
          float dataArea = smoothstep(innerRadius, innerRadius + 0.01, dist) * smoothstep(outerRadius, outerRadius - 0.01, dist);
          
          vec4 color = mix(pictureDiscColor, dataColor, dataArea * dataRatio * sampleValue);

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
          
          gl_FragColor = color;
        }`}
      />
    </div>
  );
};
