import './TronInstructions.css';

export const TronInstructions = (props: {}) => {
  return (
    <div className="tron-instructions">
      <h3>Keyboard Controls</h3>
      <ul>
        <li>
          <kbd>W</kbd> Accelerate
        </li>
        <li>
          <kbd>A</kbd> Turn Left
        </li>
        <li>
          <kbd>S</kbd> Break
        </li>
        <li>
          <kbd>D</kbd> Turn Right
        </li>
        <li>
          <kbd>C</kbd> Switch Camera
        </li>
      </ul>
    </div>
  );
};
