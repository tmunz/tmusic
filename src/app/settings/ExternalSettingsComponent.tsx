import './ExternalSettingsComponent.css';
import { Setting } from './Setting';

export const ExternalSettingsComponent = ({ setting }: { setting: Setting<number> }) => {
  return (
    <div className="external-setting">
      <label htmlFor={setting.id}>{setting.name}</label>
      <div id={setting.id}>{setting.description}</div>
    </div>
  );
};
