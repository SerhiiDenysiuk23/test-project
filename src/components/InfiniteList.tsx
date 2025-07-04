import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { IPhoto, IResponse } from '../types/IResponse';
import { ImageItem } from './ImageItem';

interface SubmissionState {
  data: Omit<IResponse, 'photos'>;
  errorMessage: string;
}

export const InfiniteList = () => {
  const [list, setList] = useState<IPhoto[]>([]);
  const elemForLoadRef = useRef<HTMLDivElement | null>(null);
  const [isPendingTransition, startTransition] = useTransition();
  const [fetchState, setSubmissionState] = useState<SubmissionState>({
    data: {
      page: 0,
      per_page: 20,
      total_results: 0,
      next_page: 'https://api.pexels.com/v1/curated?page=1&per_page=20',
    },
    errorMessage: '',
  });

  const fetchData = useCallback(async (next_page: string) => {
    try {
      const response = await fetch(next_page, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization:
            'nX7eLy9mXIcP73JMZiNVXHXH6eSSxy9QkY0fsg8FCr8YdnAJif4nNxNy',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const { photos, ...dataWithoutPhotos } = data;
      setList((prevList) => [...prevList, ...photos]);
      setSubmissionState({
        data: dataWithoutPhotos,
        errorMessage: '',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
      setSubmissionState((prevState) => ({
        ...prevState,
        errorMessage: 'Failed to fetch data',
      }));
    }
  }, []);

  useEffect(() => {
    if (!elemForLoadRef.current) return;
    const loadElem = elemForLoadRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTransition(() => fetchData(fetchState.data.next_page));
        }
      },
      { threshold: 1 }
    );
    observer.observe(loadElem);
    return () => {
      observer.unobserve(loadElem);
    };
  }, [fetchState.data, fetchData]);

  return (
    <div className="infinite-list">
      {!!list.length && (
        <ul>
          {list.map((photo) => {
            return (
              <li key={photo.id}>
                <ImageItem
                  src={photo.src.medium}
                  alt={`Photo by ${photo.photographer}`}
                  author={photo.photographer}
                />
              </li>
            );
          })}
        </ul>
      )}
      <div ref={elemForLoadRef} />
      {isPendingTransition && <div className="loader" />}
      {fetchState.errorMessage && !isPendingTransition && (
        <p>Error: {fetchState.errorMessage}</p>
      )}
    </div>
  );
};
