import { Injectable, OnDestroy, signal } from '@angular/core';
import { HitTrack } from '../models/site-catalog';

@Injectable()
export class AudioPreviewService implements OnDestroy {
  readonly playingTrackId = signal<string | null>(null);
  readonly trackProgress = signal(0);

  private audioContext: AudioContext | null = null;
  private playbackInterval: ReturnType<typeof setInterval> | null = null;

  toggleTrack(track: HitTrack): void {
    if (this.playingTrackId() === track.id) {
      this.stop();
      return;
    }

    this.stop();
    this.playingTrackId.set(track.id);
    this.trackProgress.set(8);
    this.playChordPreview(track.chordProgression, track.bpm);

    let step = 0;
    this.playbackInterval = setInterval(() => {
      step++;
      this.trackProgress.set(Math.min(100, (step / 24) * 100));

      if (step % 6 === 0 && step < 24) {
        this.playChordPreview(track.chordProgression, track.bpm);
      }

      if (step >= 24) {
        this.stop();
      }
    }, 500);
  }

  stop(): void {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }

    this.playingTrackId.set(null);
    this.trackProgress.set(0);
  }

  ngOnDestroy(): void {
    this.stop();
    if (this.audioContext) {
      void this.audioContext.close();
      this.audioContext = null;
    }
  }

  private playChordPreview(frequencies: number[], bpm: number): void {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!this.audioContext) {
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === 'suspended') {
        void this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const beatDuration = 60 / bpm;

      frequencies.forEach((frequency, index) => {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const startTime = now + index * (beatDuration * 0.65);

        oscillator.type = index % 2 === 0 ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.09, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + (index + 1) * (beatDuration * 0.65) + 0.25,
        );

        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(now + (index + 1) * (beatDuration * 0.65) + 0.3);
      });
    } catch {
      // Playback controls remain available if Web Audio is unavailable.
    }
  }
}
