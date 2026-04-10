import './SettingsComponent.css';
import { useAppState, VisualizationAction } from '../AppContext';
import { NumberInputComponent } from '../ui/input/NumberInputComponent';
import { Settings, Setting, SettingType } from './Setting';
import { ExternalSettingsComponent } from './ExternalSettingsComponent';
import { BooleanInputComponent } from '../ui/input/BooleanInputComponent';
import { OptionInputComponent } from '../ui/input/OptionInputComponent';

export const SettingsComponent = () => {
  const { appState, dispatch } = useAppState();

  const getNumberSettingComponent = (sectionKey: string, key: string, setting: Setting<number>) => {
    return (
      <NumberInputComponent
        key={key}
        {...setting}
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

  const getBooleanSettingComponent = (sectionKey: string, key: string, setting: Setting<boolean>) => {
    return (
      <BooleanInputComponent
        key={key}
        {...setting}
        onChange={(value: boolean) =>
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

  const getOptionSettingComponent = (sectionKey: string, key: string, setting: Setting<string>) => {
    return (
      <OptionInputComponent
        key={key}
        {...setting}
        onChange={(value: string) =>
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

  const sectionCount = Object.keys(appState.visualization?.settings ?? {}).length;
  const hasVisualizationSettings = sectionCount > 0;

  return (
    <div className={`settings ${hasVisualizationSettings ? 'settings-with-visualization' : ''}`}>
      {Object.entries(appState.visualization?.settings ?? {}).map(([sectionKey, section]) => (
        <section key={sectionKey}>
          <h2>{sectionKey}</h2>
          {Object.entries(section as Settings)
            .filter(([key, setting]) => {
              return setting.isVisible ? setting.isVisible(section as Settings) : true;
            })
            .map(([key, setting]) => {
              switch (setting.type) {
                case SettingType.BOOLEAN:
                  return getBooleanSettingComponent(sectionKey, key, setting);
                case SettingType.NUMBER:
                  return getNumberSettingComponent(sectionKey, key, setting);
                case SettingType.OPTION:
                  return getOptionSettingComponent(sectionKey, key, setting);
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
