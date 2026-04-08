import './NumberSettingsComponent.css';
import { Setting } from './Setting';

export const OptionSettingsComponent = ({
  setting,
  onChange,
}: {
  setting: Setting<string>;
  onChange: (value: string) => void;
}) => {
  const options = setting.params?.options as string[] | undefined;

  if (!options || options.length === 0) {
    return null;
  }

  const currentIndex = options.findIndex(option => option === setting.value);
  const selectedOption = options[currentIndex] || options[0];

  return (
    <div className="number-setting">
      <label htmlFor={setting.id}>
        {setting.name}: {selectedOption}
      </label>
      <input
        id={setting.id}
        type="range"
        value={currentIndex}
        onChange={e => onChange(options[parseInt(e.target.value, 10)])}
        min={0}
        max={options.length - 1}
        step={1}
      />
    </div>
  );
};
