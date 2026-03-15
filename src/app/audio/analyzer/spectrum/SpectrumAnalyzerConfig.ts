import { AudioAnalyzerConfig } from "../AudioAnalyzerConfig";

export interface SpectrumAnalyzerConfig extends AudioAnalyzerConfig {
  minFrequency: number;
  maxFrequency: number;
  chromaticScale: boolean;
  spectralContrastBoost: number;
}