import { PiMouse } from 'react-icons/pi';
import { Instructions } from '../../ui/instructions/Instructions';

export const FiveMilesOutInstructions = (props: {}) => {
  return (
    <Instructions
      color="#5cc9ff"
      items={[
        { key: <PiMouse />, description: 'Steering' },
        { key: 'Y', description: 'Retract/Deploy Landing Gear' },
      ]}
    />
  );
};
