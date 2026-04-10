import React from 'react';
import './TextInput.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <div className={`text-input ${className}`}>
      <input {...props} />
    </div>
  );
};
