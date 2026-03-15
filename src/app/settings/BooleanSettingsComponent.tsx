import './NumberSettingsComponent.css';
import { Setting } from './Setting';

export const BooleanSettingsComponent = ({
  setting,
  onChange,
}: {
  setting: Setting<boolean>;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="number-setting">
      <label htmlFor={setting.id}>
        {setting.name}: {setting.value ? 'ON' : 'OFF'}
      </label>
      <input
        id={setting.id}
        type="range"
        value={setting.value ? 1 : 0}
        onChange={e => onChange(e.target.value === '1')}
        min={0}
        max={1}
        step={1}
      />
    </div>
  );
};
