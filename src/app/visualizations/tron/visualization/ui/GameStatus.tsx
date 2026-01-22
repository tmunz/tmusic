import { useTronStore } from '../state/TronStore';
import './GameStatus.css';

interface GameStatusProps {
  color?: string;
}

export const GameStatus = ({ color = '#66eeff' }: GameStatusProps) => {
  const players = useTronStore(state => state.game.players);
  const characters = useTronStore(state => state.characters);
  const userId = useTronStore(state => state.userId);

  const sortedPlayers = Object.values(players).sort((a, b) => b.points - a.points);

  return (
    <div className="game-status" style={{ borderColor: color }}>
      <div className="game-status-header" style={{ color }}>
        PLAYERS
      </div>
      <div className="game-status-list">
        {sortedPlayers.map(player => {
          const character = characters[player.id];
          return (
            <div
              key={player.id}
              className={`game-status-player ${!player.alive ? 'dead' : ''}`}
              style={{ borderColor: character?.color }}
            >
              <div className="player-name" style={{ color: character?.color }}>
                {player.id === userId ? 'YOU' : player.id.toUpperCase()}
              </div>
              <div className="player-points" style={{ color }}>
                {player.points}
              </div>
              {!player.alive && (
                <div className="player-status" style={{ color: '#ff0000' }}>
                  ELIMINATED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
