import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';
import { CancelError } from '../errors/CancelError';

export class HandPoseDetector {
  private stream: MediaStream | null = null;
  private detector: handPoseDetection.HandDetector | null = null;
  private intervalId: number | null = null;
  private video: HTMLVideoElement;
  private isCancel = false;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  private async detect() {
    if (!this.detector || this.video.readyState < 2) {
      return;
    }
    const hands = await this.detector.estimateHands(this.video);
    if (!hands[0] || !hands[0].keypoints) {
      return;
    }
    const { keypoints } = hands[0];
    const diff = keypoints[4].y - keypoints[17].y;
    if (diff > 0) {
      scrollBy({ top: 100, behavior: 'smooth' });
      return;
    }
    if (diff < 0) {
      scrollBy({ top: -100, behavior: 'smooth' });
      return;
    }
  }

  private async initDetector() {
    this.detector = await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: 'mediapipe',
        modelType: 'lite',
        solutionPath: './node_modules/@mediapipe/hands',
        maxHands: 2,
      }
    );
    if (this.isCancel) {
      throw new CancelError('Cancelled');
    }
  }

  private async startCamera() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (this.isCancel) {
      throw new CancelError('Cancelled');
    }
    this.video.srcObject = this.stream;
    await this.video.play();
  }

  private startDetectionInterval() {
    if (!this.intervalId && this.detector)
      this.intervalId = setInterval(() => {
        this.detect();
      }, 100);
  }

  private stopDetectionInterval() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  handleVisibilityChange = () => {
    if (document.hidden) this.stopDetectionInterval();
    else if (!this.isCancel) this.startDetectionInterval();
  };

  async start() {
    try {
      await this.startCamera();
      if (!this.isCancel) await this.initDetector();
      this.startDetectionInterval();
    } catch (error) {
      if (!(error instanceof CancelError)) {
        // eslint-disable-next-line no-console
        console.error('Error initializing hand pose detection:', error);
      }
      this.cleanup();
    }
  }

  cleanup() {
    this.isCancel = true;
    this.stopDetectionInterval();
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
    }
  }
}
