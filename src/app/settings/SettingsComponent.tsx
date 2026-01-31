import './SettingsComponent.css';
import { useAppState, VisualizationAction } from '../AppContext';
import { NumberSettingsComponent } from './NumberSettingsComponent';
import { Settings, Setting, SettingType } from './Setting';
import { ExternalSettingsComponent } from './ExternalSettingsComponent';

export const SettingsComponent = () => {
  const { appState, dispatch } = useAppState();

  const getNumberSettingComponent = (sectionKey: string, key: string, setting: Setting<number>) => {
    return (
      <NumberSettingsComponent
        key={key}
        setting={setting as Setting<number>}
        onChange={(value: number) =>
          dispatch({
            type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
            section: sectionKey,
            key,
            value,
          })
        }
      />
    );
  };

  return (
    <div className="settings">
      {Object.entries(appState.visualization?.settings ?? {}).map(([sectionKey, section]) => (
        <section key={sectionKey}>
          <h2>{sectionKey}</h2>
          {Object.entries(section as Settings).map(([key, setting]) => {
            switch (setting.type) {
              case SettingType.NUMBER:
                return getNumberSettingComponent(sectionKey, key, setting);
              case SettingType.EXTERNAL:
                return <ExternalSettingsComponent key={key} setting={setting} />;
              default:
                return null;
            }
          })}
        </section>
      ))}
    </div>
  );
};
