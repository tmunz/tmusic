import { useState } from 'react';
import { Input } from '../../../ui/input/Input';
import './ColorCoding.css';

const START_CHAR_CODE = 64; // 65: 'A' = 1

const BASE_COLORS = [
  '#fafafa', // 0
  '#558547', // 1
  '#F1C21C', // 2
  '#8D70A6', // 3
  '#ff9d25', // 4
  '#85c7fd', // 5
  '#ffc0cb', // 6
  '#5A4089', // 7
  '#DD3C70', // 8
  '#3466BD', // 9
];
const NEUTRAL_COLOR = '#808080';

export interface ColorCodingProps {
  squareSize?: number;
  gap?: number;
  charsPerRow?: number;
}

export const ColorCoding = ({ squareSize = 30, gap = 5, charsPerRow = 10 }: ColorCodingProps) => {

  const [inputValue, setInputValue] = useState('FAC73 Blue Monday and The Beach New Order');
  const [extendedCharset, setExtendedCharset] = useState(false);

  const getColorMapping = (token: string): string[] => {
    // numbers
    if (!isNaN(parseInt(token))) {
      return token.split('').map(digit => BASE_COLORS[parseInt(digit)]);
    }

    const code = token.toUpperCase().charCodeAt(0);

    // extended character set
    if (extendedCharset && 32 < code && code <= 126) {
      if (code <= START_CHAR_CODE) {
        return getOrderColors(code);
      } else {
        return getOrderColors(code - START_CHAR_CODE);
      }
    }

    // Only A-Z
    if (START_CHAR_CODE < code && code <= 90) {
      return getOrderColors(code - START_CHAR_CODE);
    } else {
      return [NEUTRAL_COLOR];
    }
  };

  function getOrderColors(val: number): string[] {
    const firstOrder = Math.floor(val / BASE_COLORS.length);
    const secondOrder = val % BASE_COLORS.length;
    return firstOrder === 0 ? [BASE_COLORS[secondOrder]] : [BASE_COLORS[firstOrder], BASE_COLORS[secondOrder]];
  }

  const tokenizeInput = (input: string): string[] => {
    const tokens: string[] = [];
    let current = '';
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (/\d/.test(char)) {
        current += char;
      } else {
        if (current) {
          tokens.push(current);
          current = '';
        }
        tokens.push(char);
      }
    }
    if (current) {
      tokens.push(current);
    }
    return tokens;
  };

  const renderToken = (token: string, index: number) => {
    const row = Math.floor(index / charsPerRow);
    const col = index % charsPerRow;
    const x = col * (squareSize + gap);
    const y = row * (squareSize + gap);

    if (token === ' ') {
      const cx = x + squareSize / 2;
      const cy = y + squareSize / 2;
      const r = squareSize / 2;
      const points = [];
      const rotation = (2 * Math.PI) / 16;
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI / 4) * i + rotation;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        points.push(`${px},${py}`);
      }
      return (
        <polygon key={index} points={points.join(' ')} fill={NEUTRAL_COLOR} />
      );
    }

    const colorMapping = getColorMapping(token);

    if (!colorMapping) {
      return (
        <rect
          key={index}
          x={x}
          y={y}
          width={squareSize}
          height={squareSize}
          fill={NEUTRAL_COLOR}
        />
      );
    }

    const rectWidth = (squareSize - (colorMapping.length - 1)) / colorMapping.length;
    return (
      <g key={index}>
        {colorMapping.map((color, i) => (
          <rect
            key={i}
            x={x + i * (rectWidth + 1)}
            y={y}
            width={rectWidth}
            height={squareSize}
            fill={color}
          />
        ))}
      </g>
    );
  };

  const tokens = tokenizeInput(inputValue);
  const rows = Math.ceil(tokens.length / charsPerRow) || 1;
  const svgWidth = charsPerRow * (squareSize + gap) - gap;
  const svgHeight = rows * (squareSize + gap) - gap;

  return (
    <div className='color-coding'>
      <h2>Peter Saville Color Coding</h2>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Encode your text..."
      />
      <label>
        <input
          type="checkbox"
          checked={extendedCharset}
          onChange={e => setExtendedCharset(e.target.checked)}
          style={{ marginRight: '0.5em' }}
        />
        Extended character set based on Ascii ordering
      </label>
      <svg width={svgWidth} height={svgHeight}>
        {tokens.map((token, index) => renderToken(token, index))}
      </svg>
    </div>
  );
}