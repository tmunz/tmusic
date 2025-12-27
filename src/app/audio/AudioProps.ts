export interface AudioProps {
  isActive: boolean;
  onStreamCreated?: (stream: MediaStream | null) => void;
}

export interface AudioControlProps {
  isActive: boolean;
  onActivate: () => void;
  onStop: () => void;
  size?: number;
}
