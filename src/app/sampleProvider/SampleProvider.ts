export type ActiveListener = (active: boolean) => void;

export enum Channel {
  MONO = 0,
  LEFT = 0,
  RIGHT = 1,
}

export class SampleProvider {
  private _active = false;
  private _frameSize = 1;
  private _defaultValue = 0;
  private _activeListeners: ActiveListener[] = [];
  private _stereo = false;
  private _referenceNoteIndex = -1; // only used for chromatic scale to determine which note is the closest to reference A4 (440Hz)
  private _queues: Uint8Array[][] = [[], []]; // [Left/Mono channel, Right channel]
  private _sampleRate: number;
  private _size: number;

  constructor(size: number, sampleRate: number, defaultValue: Uint8Array) {
    if (size <= 0) {
      throw new Error('Queue size must be greater than 0.');
    }
    if (!defaultValue || defaultValue.length === 0) {
      throw new Error('defaultValue must be a non-empty Uint8Array.');
    }
    this._size = size;
    this._sampleRate = sampleRate;
    this._frameSize = defaultValue.length;
    this._defaultValue = defaultValue[0] ?? 0;
    this._queues[Channel.LEFT] = new Array(size).fill(defaultValue);
    this._queues[Channel.RIGHT] = new Array(size).fill(defaultValue);
  }

  get active() {
    return this._active;
  }

  onActiveChange(listener: ActiveListener) {
    this._activeListeners.push(listener);
    return () => {
      this._activeListeners = this._activeListeners.filter(l => l !== listener);
    };
  }

  private _emitActiveChange() {
    for (const listener of this._activeListeners) {
      listener(this._active);
    }
  }

  get stereo() {
    return this._stereo;
  }

  set stereo(value: boolean) {
    this._stereo = value;
  }

  get frameSize() {
    return this._frameSize;
  }

  get rps() {
    return this._active ? this._sampleRate / this._size : 0;
  }

  get referenceNoteIndex() {
    return this._referenceNoteIndex;
  }

  set referenceNoteIndex(value: number) {
    this._referenceNoteIndex = value;
  }

  get sampleSize() {
    return this._size;
  }

  get samples() {
    return this._queues[Channel.MONO];
  }

  get samplesLeft() {
    return this._queues[Channel.LEFT];
  }

  get samplesRight() {
    return this._queues[Channel.RIGHT];
  }

  push = (left?: Uint8Array, right?: Uint8Array) => {
    const prevActive = this._active;
    if (left === undefined) {
      this._active = false;
      for (let i = 0; i < this._size; i++) {
        this._queues[Channel.LEFT].unshift(new Uint8Array(this._frameSize).fill(this._defaultValue));
        if (this._queues[Channel.LEFT].length > this._size) {
          this._queues[Channel.LEFT].pop();
        }
        this._queues[Channel.RIGHT].unshift(new Uint8Array(this._frameSize).fill(this._defaultValue));
        if (this._queues[Channel.RIGHT].length > this._size) {
          this._queues[Channel.RIGHT].pop();
        }
      }
    } else {
      this._active = true;
      this._queues[Channel.LEFT].unshift(left);
      if (this._queues[Channel.LEFT].length > this._size) {
        this._queues[Channel.LEFT].pop();
      }
      if (this._stereo && right) {
        this._queues[Channel.RIGHT].unshift(right);
        if (this._queues[Channel.RIGHT].length > this._size) {
          this._queues[Channel.RIGHT].pop();
        }
      } else {
        // Mono: right channel is zeros
        this._queues[Channel.RIGHT].unshift(new Uint8Array(this._frameSize).fill(this._defaultValue));
        if (this._queues[Channel.RIGHT].length > this._size) {
          this._queues[Channel.RIGHT].pop();
        }
      }
    }
    if (this._active !== prevActive) {
      this._emitActiveChange();
    }
  };

  get = (i: number, channel: Channel = Channel.MONO): Uint8Array => {
    return this._queues[channel][i] || new Uint8Array(this._frameSize).fill(this._defaultValue);
  };

  flat = (channel: Channel = Channel.MONO) => {
    return this._queues[channel].reduce((acc: Uint8Array, value: Uint8Array, i: number) => {
      acc.set(value, i * this.frameSize);
      return acc;
    }, new Uint8Array(this.sampleSize * this.frameSize));
  };

  getAvg = (channel: Channel = Channel.MONO): number[] => {
    return this._queues[channel].map(sample => {
      return sample.reduce((acc, val) => acc + val, 0) / sample.length;
    });
  };

  // Returns the max value and the index of the sample that contains it for each frequency band (sorted by frequencies from low to high)
  getMax = (channel: Channel = Channel.MONO): { max: number; sampleIndex: number }[] => {
    if (this._queues[channel].length === 0 || this._queues[channel][0].length === 0) return [];

    return new Array(this.frameSize).fill(0).map((_, index: number) => {
      let max = 0;
      let sampleIndex = 0;

      this._queues[channel].forEach((sample, i) => {
        if (sample[index] > max) {
          max = sample[index];
          sampleIndex = i;
        }
      });

      return { max, sampleIndex };
    });
  };
}

export function createDummySampleProvider(size: number, sampleRate: number = 60, frameSize: number = 1, max: number = 255): SampleProvider {
  const provider = new SampleProvider(size, sampleRate, new Uint8Array(frameSize));
  for (let i = 0; i < size; i++) {
    const sample = new Uint8Array(frameSize);
    for (let j = 0; j < frameSize; j++) {
      const linearIndex = i * frameSize + j;
      const totalValues = size * frameSize;
      const value = Math.round((linearIndex / (totalValues - 1)) * max);
      sample[j] = value;
    }
    provider.push(sample);
  }
  return provider;
}

export function createMaxSampleProvider(size: number, sampleRate: number = 60, frameSize: number = 1, max: number = 255): SampleProvider {
  const provider = new SampleProvider(size, sampleRate, new Uint8Array(frameSize));
  for (let i = 0; i < size; i++) {
    const sample = new Uint8Array(frameSize);
    for (let j = 0; j < frameSize; j++) {
      sample[j] = max;
    }
    provider.push(sample);
  }
  return provider;
}
