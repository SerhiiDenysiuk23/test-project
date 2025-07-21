import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/core';

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => fetchUsers(),
  });
  return { ...query };
};
