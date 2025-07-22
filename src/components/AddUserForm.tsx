import { useRef, type FormEvent } from 'react';
import { useAddUser } from '../hooks/useUsers';

export const AddUserForm = () => {
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const { isPending: isPendingAddAlbum, mutate: addUserMutate } = useAddUser();

  const handleAddSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value || '';
    if (!username) return;
    addUserMutate({ id: crypto.randomUUID(), username });
    if (usernameRef.current) usernameRef.current.value = '';
  };

  return (
    <form onSubmit={handleAddSubmit} className="album-form">
      <input ref={usernameRef} placeholder="New user nickname" />
      <button type="submit" disabled={isPendingAddAlbum}>
        {
          // eslint-disable-next-line no-constant-condition
          false ? 'Update Album' : 'Add User'
        }
      </button>
    </form>
  );
};
