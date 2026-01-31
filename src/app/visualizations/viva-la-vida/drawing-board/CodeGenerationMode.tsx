import './CodeGenerationMode.css';

export interface CodeGenerationModeProps {
  mode: 'fourier' | 'vector';
  onModeChange: (mode: 'fourier' | 'vector') => void;
}

export const CodeGenerationMode = ({ mode, onModeChange }: CodeGenerationModeProps) => {
  return (
    <div className="code-generation-mode">
      <button className={`mode-tab ${mode === 'vector' ? 'active' : ''}`} onClick={() => onModeChange('vector')}>
        Vector
      </button>
      <button className={`mode-tab ${mode === 'fourier' ? 'active' : ''}`} onClick={() => onModeChange('fourier')}>
        Fourier
      </button>
    </div>
  );
};
