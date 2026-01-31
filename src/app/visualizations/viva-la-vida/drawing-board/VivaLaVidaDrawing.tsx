import { DrawingBoard } from './DrawingBoard';
import { useAppState, VisualizationAction } from '../../../AppContext';

export const VivaLaVidaDrawing = () => {
  const { dispatch, appState } = useAppState();

  return (
    <DrawingBoard
      // backgroundImageUrl={require('../viva-la-vida.jpg')}
      backgroundImageUrl={require('../visualization/delacroix-liberty-leading-the-people.jpg')}
      onPathGenerated={(path: string) => {
        dispatch({
          type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
          section: 'visualization',
          key: 'drawingPath',
          value: path,
        });
      }}
      speed={appState.visualization?.settings.visualization.speed.value ?? 1}
      onSpeedChange={(value: number) => {
        dispatch({
          type: VisualizationAction.UPDATE_VISUALIZATION_SETTINGS_VALUE,
          section: 'visualization',
          key: 'speed',
          value: value,
        });
      }}
    />
  );
};
