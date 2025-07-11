import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type FormEvent } from 'react';
import { fetchUsers, fetchAlbums, createAlbum, type User } from '../api/core';
import { AlbumCard } from './AlbumCard';
import { Pagination } from './Pagination';

const LIMIT = 11;

const findUsername = (userId: string | number, users?: User[]) => {
  return users?.find((u) => u.id == userId)?.username || 'Unknown';
};

export const AlbumsPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const userRef = useRef<HTMLSelectElement | null>(null);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });
  const {
    data: albumsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['albums', page],
    queryFn: () => fetchAlbums(page, LIMIT),
  });

  const {
    isPending: isPendingAddAlbum,
    variables: addAlbumVariables,
    mutate: addAlbumMutate,
  } = useMutation({
    mutationFn: ({ title, userId }: { title: string; userId: number }) =>
      createAlbum(title, userId),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['albums'] }),
  });

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value || '';
    const userId = Number(userRef.current?.value);
    if (title && userId) {
      addAlbumMutate({ title, userId });
      if (titleRef.current) titleRef.current.value = '';
    }
  };

  if (isLoading) {
    return <div className="loader" />;
  }
  if (isError) {
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
        {isPendingAddAlbum && (
          <AlbumCard
            album={addAlbumVariables}
            username={findUsername(addAlbumVariables.userId, users)}
          />
        )}
        {!!albumsData &&
          albumsData.data.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              username={findUsername(album.userId, users)}
            />
          ))}
      </div>

      <Pagination
        currentPage={page}
        totalCount={albumsData?.totalCount ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />
    </section>
  );
};
