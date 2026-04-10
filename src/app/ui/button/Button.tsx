import './Button.css';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

interface BaseButtonProps {
  className?: string;
}

type ButtonAsButton = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsLink = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className = '', ...props }, ref) => {
    const buttonClassName = `button ${className}`;

    return (
      <button {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} className={buttonClassName} ref={ref as any} />
    );
  }
);

Button.displayName = 'Button';
