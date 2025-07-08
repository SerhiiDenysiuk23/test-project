import { useEffect, useRef } from 'react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@mediapipe/hands';

interface Props {
  effectTrigger: number;
}

const closeStream = (stream: MediaStream | null) => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
};

export const HandPoseScroller = ({ effectTrigger }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoCurrent = videoRef.current;
    let stream: MediaStream | null = null;
    let detector: handPoseDetection.HandDetector | null = null;
    let intervalId: number | null = null;
    let isCancel = false;
    const startCamera = async () => {
      const streamTmp = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (isCancel) {
        closeStream(streamTmp);
        return;
      }
      stream = streamTmp;
      videoCurrent.srcObject = stream;
      await videoCurrent.play();
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
      const detectorTmp = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
          runtime: 'mediapipe',
          modelType: 'lite',
          solutionPath: './node_modules/@mediapipe/hands',
          maxHands: 2,
        }
      );
      if (isCancel) {
        detectorTmp.dispose();
        return;
      }
      detector = detectorTmp;
    };

    const startDetectionInterval = () => {
      if (!intervalId && detector)
        intervalId = setInterval(() => {
          detect();
        }, 100);
    };
    const stopDetectionInterval = () => {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopDetectionInterval();
      else if (!isCancel) startDetectionInterval();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    (async () => {
      try {
        await startCamera();
        if (!isCancel) await initDetector();
        startDetectionInterval();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error initializing hand pose detection:', error);
        cleanup();
      }
    })();

    function cleanup() {
      stopDetectionInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      videoCurrent.pause();
      closeStream(stream);
      if (detector) {
        detector.dispose();
      }
    }

    return () => {
      isCancel = true;
      cleanup();
    };
  }, [effectTrigger]);

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
