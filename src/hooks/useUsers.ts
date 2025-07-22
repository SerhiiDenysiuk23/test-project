import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, fetchUsers, type User } from '../api/core';

const USERS_KEY = 'users';
const LIST_KEY = 'list';

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: [USERS_KEY, LIST_KEY],
    queryFn: () => fetchUsers(),
  });
  return { ...query };
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const key = [USERS_KEY, LIST_KEY];

  const mutation = useMutation({
    mutationKey: key,
    mutationFn: (user: User) => createUser(user),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });

      queryClient.setQueryData<User[]>(key, (prev) =>
        prev ? [album, ...prev] : undefined
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: key }) !== 1) return;
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  return mutation;
};
