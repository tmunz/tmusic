import './IconToggleButton.css';
import { IconType } from 'react-icons';
import { IconButton } from './IconButton';

interface IconToggleButtonProps {
  activeIcon: IconType;
  inactiveIcon: IconType;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  title?: string;
  size?: number;
}

export const IconToggleButton = ({
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  isActive,
  onClick,
  className = '',
  title,
  size = 36,
}: IconToggleButtonProps) => {
  return (
    <IconButton
      className={`icon-toggle-button ${isActive ? 'icon-toggle-active' : ''} ${className}`}
      onClick={onClick}
      title={title}
    >
      <ActiveIcon size={size} className="icon-fade" />
      <InactiveIcon size={size} className="icon-fade" />
    </IconButton>
  );
};
