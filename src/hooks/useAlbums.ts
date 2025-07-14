import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAlbum,
  deleteAlbum,
  fetchAlbums,
  updateAlbum,
  type Album,
} from '../api/core';
import { useSearchParams } from 'react-router-dom';

const ALBUMS_KEY = 'albums';
const LIST_KEY = 'list';

export const useGetAlbums = (limit: number) => {
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');

  const query = useQuery({
    queryKey: [ALBUMS_KEY, LIST_KEY, page],
    queryFn: () => fetchAlbums(page, limit),
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

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');

  const key = [ALBUMS_KEY, LIST_KEY, page];

  const mutation = useMutation({
    mutationFn: (album: Album) => updateAlbum(album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });
      const prevList = queryClient.getQueryData(key);

      queryClient.setQueryData(
        key,
        (old: { data: Album[]; totalCount: number }) => {
          const i = old.data.findIndex((x) => x.id == album.id);
          if (old && i !== -1) {
            const newList = [...old.data];
            newList[i] = album;
            return {
              ...old,
              data: newList,
            };
          }
          return;
        }
      );
      return { prevList };
    },
    onError: (err, _, context) => {
      // eslint-disable-next-line no-console
      console.error(err);
      queryClient.setQueryData(key, context?.prevList);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  return mutation;
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1');

  const key = [ALBUMS_KEY, LIST_KEY, page];

  const mutation = useMutation({
    mutationFn: (album: Album) => deleteAlbum(album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });
      const prevList = queryClient.getQueryData(key);

      queryClient.setQueryData(
        key,
        (old: { data: Album[]; totalCount: number }) =>
          old
            ? {
                totalCount: old.totalCount - 1,
                data: old.data.filter((x) => x.id !== album.id),
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
