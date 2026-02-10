import { Instructions } from '../../ui/instructions/Instructions';

export const TronInstructions = (props: {}) => {
  return (
    <Instructions
      color="#66eeff"
      items={[
        { key: 'W', description: 'Accelerate' },
        { key: 'A', description: 'Turn Left' },
        { key: 'S', description: 'Deccelerate' },
        { key: 'D', description: 'Turn Right' },
        { key: 'C', description: 'Switch Camera' },
        { key: 'M', description: 'Toggle Debug Mode' },
      ]}
    />
  );
};
