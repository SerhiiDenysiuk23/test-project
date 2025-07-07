import { useEffect, useRef } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';

export const HandPoseScroller = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoCurrent = videoRef.current;
    let detector: handPoseDetection.HandDetector | null = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoCurrent.srcObject = stream;
        await new Promise((resolve) => {
          videoCurrent.onloadedmetadata = () => {
            resolve(null);
          };
        });
        await videoCurrent.play();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error accessing webcam:', error);
      }
    };

    const detect = async () => {
      if (!detector || videoCurrent.readyState < 2) {
        return;
      }
      const hands = await detector.estimateHands(videoCurrent);
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
    };

    const initDetector = async () => {
      await startCamera();
      try {
        detector = await handPoseDetection.createDetector(
          handPoseDetection.SupportedModels.MediaPipeHands,
          {
            runtime: 'mediapipe',
            modelType: 'lite',
            solutionPath: './node_modules/@mediapipe/hands',
            maxHands: 2,
          }
        );
        setInterval(() => {
          detect();
        }, 100);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error initializing handpose detector:', err);
      }
    };

    initDetector();

    return () => {
      videoCurrent.pause();
      const stream = videoCurrent.srcObject as MediaStream | null;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      videoCurrent.onloadedmetadata = null;
      videoCurrent.srcObject = null;
      if (detector) {
        detector.dispose();
        detector = null;
      }
    };
  }, []);

  return (
    <>
      <video
        style={{ display: 'none' }}
        ref={videoRef}
        width={500}
        height={500}
      />
    </>
  );
};
