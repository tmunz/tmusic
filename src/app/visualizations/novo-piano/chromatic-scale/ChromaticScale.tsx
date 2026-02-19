import { useAppState, VisualizationAction } from '../../../AppContext';
import { useState } from 'react';

interface PianoPreset {
  id: string;
  keys: number;
  minFrequency: number;
  maxFrequency: number;
  description: string;
}

const PIANO_PRESETS: PianoPreset[] = [
  { id: '49', keys: 49, minFrequency: 65.4, maxFrequency: 1046, description: '49 keys (C2-C6) - Compact keyboard' }, // a at index 33
  { id: '61', keys: 61, minFrequency: 65.4, maxFrequency: 2093, description: '61 keys (C2-C7) - Standard keyboard' }, // a at index 33
  { id: '76', keys: 76, minFrequency: 41.2, maxFrequency: 3136, description: '76 keys (E1-G7) - Extended keyboard' }, // a at index 41
  { id: '88', keys: 88, minFrequency: 27.5, maxFrequency: 4186, description: '88 keys (A0-C8) - Full piano' }, // a at index 48
];

export const ChromaticScale = () => {
  const { appState, dispatch } = useAppState();
  const [selectedPreset, setSelectedPreset] = useState('61');

  const applyPreset = (preset: PianoPreset) => {
    setSelectedPreset(preset.id);
    dispatch({
      type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
      section: 'samples',
      key: 'frequencyBands',
      value: preset.keys,
    });

    dispatch({
      type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
      section: 'samples',
      key: 'minFrequency',
      value: preset.minFrequency,
    });

    dispatch({
      type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
      section: 'samples',
      key: 'maxFrequency',
      value: preset.maxFrequency,
    });

    dispatch({
      type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
      section: 'samples',
      key: 'chromaticScale',
      value: 1, // true
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Chromatic Scale</h2>
      <p>
        The chromatic scale maps frequency bands logarithmically to match musical notes.
        Works best with piano music or any music where distinct notes are prominent. 
        There will be resonances, that can be reduced by increasing the spectral contrast boost.
      </p>
      <h2>Piano Presets</h2>
      {PIANO_PRESETS.map(preset => (
        <label
          key={preset.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            backgroundColor: selectedPreset === preset.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          }}
        >
          <input
            type="radio"
            name="piano-preset"
            value={preset.id}
            checked={selectedPreset === preset.id}
            onChange={() => applyPreset(preset)}
            style={{ cursor: 'pointer' }}
          />
          <span>
            {preset.description}
          </span>
        </label>
      ))}
    </div>
  );
}