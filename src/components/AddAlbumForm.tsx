import { useEffect, useRef, type FormEvent } from 'react';
import { useAddAlbum, useUpdateAlbum } from '../hooks/useAlbums';
import type { Album, User } from '../api/core';

interface Props {
  users: User[];
  editableAlbum: Album | null;
  onCleanUpEditable: () => void;
}

export const AddAlbumForm = ({
  users,
  editableAlbum,
  onCleanUpEditable,
}: Props) => {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const userRef = useRef<HTMLSelectElement | null>(null);
  const editId = editableAlbum?.id;

  const { mutate: updateAlbumMutation } = useUpdateAlbum();
  const { isPending: isPendingAddAlbum, mutate: addAlbumMutate } =
    useAddAlbum();

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = titleRef.current?.value || '';
    const userId = userRef.current?.value || '';
    if (!(title && userId)) return;

    if (editId) {
      updateAlbumMutation({ title, userId, id: editId });
      onCleanUpEditable();
    } else addAlbumMutate({ title, userId, id: crypto.randomUUID() });

    if (titleRef.current) titleRef.current.value = '';
    if (userRef.current) userRef.current.value = '';
  };

  useEffect(() => {
    if (!(titleRef.current && userRef.current)) return;
    titleRef.current.value = editableAlbum?.title ?? '';
    userRef.current.value = editableAlbum?.userId.toString() ?? '';
  }, [editableAlbum]);

  return (
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
        {editId ? 'Update Album' : 'Add Album'}
      </button>
    </form>
  );
};
