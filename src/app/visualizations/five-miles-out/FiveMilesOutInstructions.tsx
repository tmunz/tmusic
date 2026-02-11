import { PiMouse } from 'react-icons/pi';
import { Instructions } from '../../ui/instructions/Instructions';

export const FiveMilesOutInstructions = (props: {}) => {
  return (
    <Instructions
      color="#5cc9ff"
      items={[
        { key: 'L', description: 'Toggle Steering Lock' },
        { key: <PiMouse />, description: 'Steering (only if unlocked by L)' },
        { key: 'W', description: 'Increase Speed (Reduce Sample Size)' },
        { key: 'S', description: 'Decrease Speed (Increase Sample Size)' },
        { key: 'Y', description: 'Retract/Deploy Landing Gear' },
      ]}
    />
  );
};
