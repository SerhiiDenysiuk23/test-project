import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAlbum, fetchAlbums, type Album } from '../api/core';
import { useSearchParams } from 'react-router-dom';

const ALBUMS_KEY = 'albums';
const LIST_KEY = 'list';

export const useGetAlbums = (limit: number) => {
  const [searchParams] = useSearchParams();
  const _page = parseInt(searchParams.get('page') ?? '1');

  const query = useQuery({
    queryKey: [ALBUMS_KEY, LIST_KEY, _page],
    queryFn: () => fetchAlbums(_page, limit),
    staleTime: 5 * 60 * 1000,
  });

  return { ...query };
};

export const useAddAlbum = () => {
  const queryClient = useQueryClient();

  const key = [ALBUMS_KEY, LIST_KEY, 1];

  const mutation = useMutation({
    mutationFn: ({ title, userId }: Omit<Album, 'id'>) =>
      createAlbum(title, userId),
    onMutate: async ({ title, userId }) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });
      const newId = Math.random();
      const prevList = queryClient.getQueryData(key);

      queryClient.setQueryData(
        key,
        (old: { data: Album[]; totalCount: number }) =>
          old
            ? {
                totalCount: old.totalCount + 1,
                data: [{ title, userId, id: -newId }, ...old.data],
              }
            : undefined
      );
      return { prevList };
    },
    onError: (err, _, context) => {
      // eslint-disable-next-line no-console
      console.error(err);
      queryClient.setQueryData(key, context?.prevList);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [ALBUMS_KEY, LIST_KEY] }),
  });

  return mutation;
};
