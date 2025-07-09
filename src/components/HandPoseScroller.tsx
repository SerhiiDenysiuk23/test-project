import { useEffect, useRef } from 'react';
import { HandPoseDetector } from '../utils/HandPoseDetector';

interface Props {
  effectTrigger: number;
}

export const HandPoseScroller = ({ effectTrigger }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const poseDetector = new HandPoseDetector(videoRef.current);

    document.addEventListener(
      'visibilitychange',
      poseDetector.handleVisibilityChange
    );

    poseDetector.start();

    return () => {
      document.removeEventListener(
        'visibilitychange',
        poseDetector.handleVisibilityChange
      );
      poseDetector.cleanup();
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
