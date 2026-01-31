import './GLSLOutput.css';

interface GLSLOutputProps {
  code: string;
  strokeCount: number;
  totalPoints: number;
  currentTime?: number;
  totalDuration?: number;
  currentStrokeIndex?: number;
}

export const GLSLOutput = ({
  code,
  strokeCount,
  totalPoints,
  currentTime,
  totalDuration,
  currentStrokeIndex,
}: GLSLOutputProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="glsl-output">
      <div className="output-header">
        <div className="output-info">
          <span>Strokes: {strokeCount}</span>
          <span>Points: {totalPoints}</span>
          {currentTime !== undefined && totalDuration !== undefined && currentStrokeIndex !== undefined && (
            <>
              <span>Time: {(currentTime % strokeCount).toFixed(2)}</span>
            </>
          )}
        </div>
        {code && (
          <button onClick={copyToClipboard} className="copy-button">
            Copy GLSL Code
          </button>
        )}
      </div>

      {code && (
        <div className="code-container">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
