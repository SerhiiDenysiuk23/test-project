import { AlbumCard } from './AlbumCard';
import { Pagination } from './Pagination';
import { useGetUsers } from '../hooks/useUsers';
import { useDeleteAlbum, useGetAlbums } from '../hooks/useAlbums';
import { LIMIT, type Album, type User } from '../api/core';
import { useSearchParams } from 'react-router-dom';
import { AddAlbumForm } from './AddAlbumForm';
import { useState } from 'react';
import { AddUserForm } from './AddUserForm';

const findUsername = (userId: string | number, users?: User[]) => {
  return users?.find((u) => u.id == userId)?.username || 'Unknown';
};

export const AlbumsPage = () => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');

  const { data: users } = useGetUsers();
  const { data: albumsData, isLoading, isError } = useGetAlbums(page);
  const [editableAlbum, setEditableAlbum] = useState<Album | null>(null);

  const { mutate: deleteAlbumMutate } = useDeleteAlbum();

  if (isLoading) {
    return <div className="loader" />;
  }
  if (!albumsData && isError) {
    return <p>❌ Error loading albums</p>;
  }

  const handleDeleteAlbum = (album: Album) => {
    if (!confirm(`Delete album "${album.title}"?`)) return;
    deleteAlbumMutate(album);
  };

  const handleCleanUpEditable = () => {
    setEditableAlbum(null);
  };

  return (
    <section className="container">
      <h2>📸 Albums</h2>

      <AddAlbumForm
        users={users ?? []}
        editableAlbum={editableAlbum}
        onCleanUpEditable={handleCleanUpEditable}
      />

      <AddUserForm />

      <div className="album-list">
        {!!albumsData &&
          albumsData.data.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              username={findUsername(album.userId, users)}
              onDelete={handleDeleteAlbum}
              onEdit={setEditableAlbum}
            />
          ))}
      </div>

      <Pagination totalCount={albumsData?.totalCount ?? 0} limit={LIMIT} />
    </section>
  );
};
