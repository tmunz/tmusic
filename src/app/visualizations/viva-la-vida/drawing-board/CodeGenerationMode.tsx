import './CodeGenerationMode.css';

export interface CodeGenerationModeProps {
  mode: 'fourier' | 'vector';
  onModeChange: (mode: 'fourier' | 'vector') => void;
  children: React.ReactNode;
}

export const CodeGenerationMode = ({ mode, onModeChange, children }: CodeGenerationModeProps) => {
  return (
    <div className="code-generation-mode">
      <div className="mode-tabs">
        <button className={`mode-tab ${mode === 'vector' ? 'active' : ''}`} onClick={() => onModeChange('vector')}>
          Vector
        </button>
        <button className={`mode-tab ${mode === 'fourier' ? 'active' : ''}`} onClick={() => onModeChange('fourier')}>
          Fourier
        </button>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};
