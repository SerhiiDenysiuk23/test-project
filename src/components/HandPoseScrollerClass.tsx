import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';
import React from 'react';
import { CancelError } from '../errors/CancelError';

interface Props {
  effectTrigger: number;
}

export class HandPoseScrollerClass extends React.Component<Props> {
  private videoRef = React.createRef<HTMLVideoElement>();
  private stream: MediaStream | null = null;
  private detector: handPoseDetection.HandDetector | null = null;
  private intervalId: number | null = null;
  private sessionId = 0;

  componentDidMount() {
    this.startInitialization();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.effectTrigger !== this.props.effectTrigger) {
      this.sessionId++;
      this.cleanup();
      this.startInitialization();
    }
  }

  componentWillUnmount() {
    this.sessionId++;
    this.cleanup();
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );
  }

  private handleVisibilityChange = () => {
    if (document.hidden) this.stopDetectionInterval();
    else this.startDetectionInterval();
  };

  private startInitialization() {
    const currentSession = ++this.sessionId;
    (async () => {
      try {
        await this.startCamera(currentSession);
        await this.initDetector(currentSession);
        this.startDetectionInterval(currentSession);
      } catch (error) {
        if (!(error instanceof CancelError)) {
          // eslint-disable-next-line no-console
          console.error('Error initializing hand pose detection:', error);
        }
      }
    })();
  }

  private async startCamera(session: number) {
    const video = this.videoRef.current;
    if (session !== this.sessionId) throw new CancelError('Cancelled');
    if (this.stream || !video) return;

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (session !== this.sessionId) {
      newStream.getTracks().forEach((t) => t.stop());
      throw new CancelError('Cancelled');
    }
    this.stream = newStream;
    video.srcObject = newStream;
    await video.play();
  }

  private async initDetector(session: number) {
    if (session !== this.sessionId) throw new CancelError('Cancelled');
    this.detector = await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: 'mediapipe',
        modelType: 'lite',
        solutionPath: './node_modules/@mediapipe/hands',
        maxHands: 1,
      }
    );
  }

  private startDetectionInterval(session?: number) {
    if (session && session !== this.sessionId) return;
    if (!this.intervalId && this.detector) {
      this.intervalId = window.setInterval(() => this.detect(), 100);
    }
  }

  private stopDetectionInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async detect() {
    const video = this.videoRef.current;
    if (!this.detector || !video || video.readyState < 2) return;
    const hands = await this.detector.estimateHands(video);
    if (!hands[0]?.keypoints) return;
    const diff = hands[0].keypoints[4].y - hands[0].keypoints[17].y;
    window.scrollBy({
      top: diff > 0 ? 100 : diff < 0 ? -100 : 0,
      behavior: 'smooth',
    });
  }

  private cleanup() {
    this.stopDetectionInterval();
    const videoCurrent = this.videoRef.current;
    if (videoCurrent) {
      videoCurrent.pause();
      videoCurrent.srcObject = null;
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

  render() {
    return (
      <video
        ref={this.videoRef}
        style={{ display: 'none' }}
        width={500}
        height={500}
      />
    );
  }
}
