import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <div className={`input ${className}`}>
      <input {...props} />
    </div>
  );
};
