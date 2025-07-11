import { useParams } from 'react-router-dom';
import { ImageItem } from './ImageItem';
import { useQuery } from '@tanstack/react-query';
import { fetchPhotosByAlbum } from '../api/core';

export const PhotosPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const {
    data: photos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['photos', albumId],
    queryFn: () => fetchPhotosByAlbum(albumId ?? ''),
  });

  return (
    <div className="infinite-list">
      {!!photos && (
        <ul>
          {photos.map((photo) => {
            return (
              <li key={photo.id}>
                <ImageItem
                  src={`https://picsum.photos/seed/${photo.id}/200/300`}
                  alt={photo.title}
                  author={photo.title}
                />
              </li>
            );
          })}
        </ul>
      )}
      {isLoading && <div className="loader" />}
      {isError && <p>Error: {error.message}</p>}
    </div>
  );
};
