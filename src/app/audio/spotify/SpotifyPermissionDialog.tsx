import { createPortal } from 'react-dom';
import './SpotifyPermissionDialog.css';

interface SpotifyPermissionDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SpotifyPermissionDialog = ({ isOpen, onConfirm, onCancel }: SpotifyPermissionDialogProps) => {
  if (!isOpen) return null;

  const dialog = (
    <div className="spotify-permission-overlay" onClick={onCancel}>
      <div className="spotify-permission-dialog" onClick={e => e.stopPropagation()}>
        <div className="spotify-permission-header">
          <h3>Screen Sharing Required</h3>
        </div>

        <div className="spotify-permission-content">
          <p>
            To capture Spotify audio for visualization, we need to use screen sharing due to technical limitations of
            the Spotify integration.
          </p>

          <div className="spotify-permission-steps">
            <h4>What will happen next:</h4>
            <ol>
              <li>Your browser will ask for screen sharing permission</li>
              <li>
                Make sure to check <strong>"Share audio"</strong> checkbox
              </li>
            </ol>
          </div>

          <div className="spotify-permission-note">
            <p>
              <strong>Note:</strong> This only captures audio for the music visualization. No video or personal data is
              stored or transmitted.
            </p>
          </div>
        </div>

        <div className="spotify-permission-buttons">
          <button className="spotify-permission-button spotify-permission-button--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="spotify-permission-button spotify-permission-button--confirm" onClick={onConfirm}>
            Continue & Share Screen
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
};
