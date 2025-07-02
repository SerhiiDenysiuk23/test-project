import { useCallback, useEffect, useRef, useState } from 'react';
import type { IPhoto, IResponse } from '../types/IResponse';
import ImageItem from './ImageItem';

interface SubmissionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: Omit<IResponse, 'photos'> | null;
  message: string;
}

const InfiniteList = () => {
  const [state, setState] = useState<SubmissionState>({
    status: 'idle',
    data: null,
    message: '',
  });
  const [list, setList] = useState<IPhoto[]>([]);
  const elemForLoadRef = useRef<HTMLLIElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = useCallback(
    async (nextPage?: string): Promise<SubmissionState> => {
      try {
        const response = await fetch(
          nextPage ?? 'https://api.pexels.com/v1/curated?page=1&per_page=40',
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization:
                'nX7eLy9mXIcP73JMZiNVXHXH6eSSxy9QkY0fsg8FCr8YdnAJif4nNxNy',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);

        const { photos, ...dataWithoutPhotos } = data;
        const result: SubmissionState = {
          status: 'success',
          data: dataWithoutPhotos,
          message: 'Data fetched successfully',
        };
        setList([...list, ...photos]);
        setState({
          status: 'success',
          data: dataWithoutPhotos,
          message: 'Data fetched successfully',
        });
        return result;
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
        const result: SubmissionState = {
          status: 'error',
          data: null,
          message: 'Failed to fetch data',
        };
        setState(result);
        return result;
      }
    },
    [list]
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (elemForLoadRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const nextPage = state.data?.next_page;
            if (nextPage) {
              fetchData(nextPage);
            }
          }
        },
        { threshold: 1.0 }
      );
      observer.current.observe(elemForLoadRef.current);
    }

    return () => {
      if (observer.current && elemForLoadRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.current.unobserve(elemForLoadRef.current);
      }
    };
  }, [fetchData, list, state.data?.next_page]);

  return (
    <div className="infinite-list">
      <h1>Infinite List</h1>
      {state.status === 'pending' && <p>Loading...</p>}
      {state.status === 'error' && <p>Error: {state.message}</p>}
      {state.status === 'success' && list && (
        <ul>
          {list.map((photo, index) => (
            <li
              ref={index === list.length - 1 ? elemForLoadRef : undefined}
              key={photo.id}
            >
              <ImageItem
                src={photo.src.medium}
                alt={`Photo by ${photo.photographer}`}
                author={photo.photographer}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfiniteList;
