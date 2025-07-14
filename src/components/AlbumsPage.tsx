import { useRef, useState, type FormEvent } from 'react';
import { AlbumCard } from './AlbumCard';
import { Pagination } from './Pagination';
import { useGetUsers } from '../hooks/useUsers';
import {
  useAddAlbum,
  useDeleteAlbum,
  useGetAlbums,
  useUpdateAlbum,
} from '../hooks/useAlbums';
import type { Album, User } from '../api/core';

const LIMIT = 11;

const findUsername = (userId: string | number, users?: User[]) => {
  return users?.find((u) => u.id == userId)?.username || 'Unknown';
};

export const AlbumsPage = () => {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const userRef = useRef<HTMLSelectElement | null>(null);
  const [editId, setEditId] = useState<string | number | null>(null);

  const { data: users } = useGetUsers();
  const { data: albumsData, isLoading, isError } = useGetAlbums(LIMIT);
  const { isPending: isPendingAddAlbum, mutate: addAlbumMutate } =
    useAddAlbum();
  const { mutate: deleteAlbumMutate } = useDeleteAlbum();
  const { mutate: updateAlbumMutation } = useUpdateAlbum();

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value || '';
    const userId = userRef.current?.value || '';
    if (!(title && userId)) return;

    if (editId) {
      updateAlbumMutation({ title, userId, id: editId });
      setEditId(null);
    } else addAlbumMutate({ title, userId });

    if (titleRef.current) titleRef.current.value = '';
    if (userRef.current) userRef.current.value = '';
  };

  const handleDeleteAlbum = (album: Album) => {
    if (!confirm(`Delete album "${album.title}"?`)) return;
    deleteAlbumMutate(album);
  };

  const handleUpdateAlbum = (album: Album) => {
    setEditId(album.id);
    if (titleRef.current) titleRef.current.value = album.title;
    if (userRef.current) userRef.current.value = album.userId.toString();
  };

  if (isLoading) {
    return <div className="loader" />;
  }
  if (!albumsData && isError) {
    return <p>❌ Error loading albums</p>;
  }

  return (
    <section className="container">
      <h2>📸 Albums</h2>

      <form onSubmit={handleAddSubmit} className="album-form">
        <input ref={titleRef} placeholder="New album title" />
        <select ref={userRef} defaultValue="">
          <option value="" disabled>
            Select user
          </option>
          {!!users &&
            users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
        </select>
        <button type="submit" disabled={isPendingAddAlbum}>
          Add Album
        </button>
      </form>

      <div className="album-list">
        {!!albumsData &&
          albumsData.data.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              username={findUsername(album.userId, users)}
              onDelete={handleDeleteAlbum}
              onEdit={handleUpdateAlbum}
            />
          ))}
      </div>

      <Pagination totalCount={albumsData?.totalCount ?? 0} limit={LIMIT} />
    </section>
  );
};
