import { ReactNode } from 'react';
import './Instructions.css';

export interface InstructionItem {
  key: ReactNode;
  description: string;
}

export interface InstructionsProps {
  title?: string;
  items: InstructionItem[];
  className?: string;
  color?: string;
}

export const Instructions = ({ title = 'Controls', items, className = '', color }: InstructionsProps) => {
  return (
    <div
      className={`instructions ${className}`}
      style={color ? ({ '--instructions-color': color } as React.CSSProperties) : undefined}
    >
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <kbd>{item.key}</kbd>
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};
