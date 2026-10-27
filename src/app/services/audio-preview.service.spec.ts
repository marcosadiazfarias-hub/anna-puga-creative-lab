import { TestBed } from '@angular/core/testing';
import { HIT_TRACKS } from '../data/site-catalog';
import { AudioPreviewService } from './audio-preview.service';

describe('AudioPreviewService', () => {
  let service: AudioPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioPreviewService],
    });
    service = TestBed.inject(AudioPreviewService);
  });

  afterEach(() => {
    service.ngOnDestroy();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts playback, updates progress and previews chords until playback completes', async () => {
    vi.useFakeTimers();
    const oscillator = {
      type: 'sine' as OscillatorType,
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    const gain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
    class MockAudioContext {
      state = 'running' as AudioContextState;
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => oscillator);
      createGain = vi.fn(() => gain);
      resume = vi.fn();
      close = vi.fn();
    }
    vi.stubGlobal('AudioContext', MockAudioContext);

    const track = HIT_TRACKS[0];
    service.toggleTrack(track);
    expect(service.playingTrackId()).toBe(track.id);
    expect(service.trackProgress()).toBe(8);
    expect(oscillator.start).toHaveBeenCalledTimes(track.chordProgression.length);

    await vi.advanceTimersByTimeAsync(3000);
    expect(service.trackProgress()).toBe(25);
    expect(oscillator.start).toHaveBeenCalledTimes(track.chordProgression.length * 2);

    await vi.advanceTimersByTimeAsync(9000);
    expect(service.playingTrackId()).toBeNull();
    expect(service.trackProgress()).toBe(0);
  });

  it('resumes suspended audio and stops the active interval on demand', () => {
    vi.useFakeTimers();
    const resume = vi.fn();
    class MockAudioContext {
      state = 'suspended' as AudioContextState;
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => ({
        type: 'sine' as OscillatorType,
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }));
      createGain = vi.fn(() => ({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      }));
      resume = resume;
      close = vi.fn();
    }
    vi.stubGlobal('AudioContext', MockAudioContext);

    service.toggleTrack(HIT_TRACKS[0]);
    expect(resume).toHaveBeenCalledOnce();

    service.stop();
    expect(service.playingTrackId()).toBeNull();
    expect(service.trackProgress()).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('toggles off the current track and replaces it when a different track starts', () => {
    vi.useFakeTimers();
    const firstTrack = HIT_TRACKS[0];
    const secondTrack = HIT_TRACKS[1];

    service.toggleTrack(firstTrack);
    service.toggleTrack(firstTrack);
    expect(service.playingTrackId()).toBeNull();
    expect(vi.getTimerCount()).toBe(0);

    service.toggleTrack(firstTrack);
    service.toggleTrack(secondTrack);
    expect(service.playingTrackId()).toBe(secondTrack.id);
    expect(service.trackProgress()).toBe(8);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('keeps the playback controls available if Web Audio is unavailable', () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'AudioContext',
      class {
        constructor() {
          throw new Error('Audio is unavailable');
        }
      },
    );

    service.toggleTrack(HIT_TRACKS[0]);

    expect(service.playingTrackId()).toBe(HIT_TRACKS[0].id);
    expect(service.trackProgress()).toBe(8);
  });

  it('closes the audio context when the service is destroyed', () => {
    vi.useFakeTimers();
    const close = vi.fn();
    class MockAudioContext {
      state = 'running' as AudioContextState;
      currentTime = 0;
      destination = {};
      createOscillator = vi.fn(() => ({
        type: 'sine' as OscillatorType,
        frequency: { setValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      }));
      createGain = vi.fn(() => ({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      }));
      resume = vi.fn();
      close = close;
    }
    vi.stubGlobal('AudioContext', MockAudioContext);

    service.toggleTrack(HIT_TRACKS[0]);
    service.ngOnDestroy();

    expect(close).toHaveBeenCalledOnce();
    expect(service.playingTrackId()).toBeNull();
  });
});

