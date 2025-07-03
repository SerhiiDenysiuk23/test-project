import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import type { IPhoto, IResponse } from '../types/IResponse';
import ImageItem from './ImageItem';

interface SubmissionState {
  data: Omit<IResponse, 'photos'> | null;
  message: string;
}

const InfiniteList = () => {
  const [list, setList] = useState<IPhoto[]>([]);
  const elemForLoadRef = useRef<HTMLLIElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [isPendingTransition, startTransition] = useTransition();

  const [fetchState, action, isPending] = useActionState(
    async (state: SubmissionState): Promise<SubmissionState> => {
      try {
        const response = await fetch(
          state.data?.next_page ??
            'https://api.pexels.com/v1/curated?page=1&per_page=20',
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
        const { photos, ...dataWithoutPhotos } = data;
        setList((prevList) => [...prevList, ...photos]);
        return {
          data: dataWithoutPhotos,
          message: 'Data fetched successfully',
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
        return {
          data: null,
          message: 'Failed to fetch data',
        };
      }
    },
    { data: null, message: '' }
  );

  const triggerFetch = useCallback(() => {
    startTransition(() => {
      action();
    });
  }, [action]);

  useEffect(() => {
    triggerFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (elemForLoadRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const nextPage = fetchState.data?.next_page;
            if (nextPage) {
              triggerFetch();
            }
          }
        },
        { threshold: 1 }
      );
      observer.current.observe(elemForLoadRef.current);
    }

    return () => {
      if (observer.current && elemForLoadRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.current.unobserve(elemForLoadRef.current);
      }
    };
  }, [triggerFetch, fetchState.data?.next_page, isPending]);

  return (
    <div className="infinite-list">
      {!!list.length && (
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
      {(isPending || isPendingTransition) && <div className="loader" />}
      {fetchState.data == null &&
        fetchState.message &&
        !(isPending || isPendingTransition) && (
          <p>Error: {fetchState.message}</p>
        )}
    </div>
  );
};

export default InfiniteList;
