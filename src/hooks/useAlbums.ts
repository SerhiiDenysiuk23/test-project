import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAlbum,
  deleteAlbum,
  fetchAlbums,
  updateAlbum,
  type Album,
} from '../api/core';

const ALBUMS_KEY = 'albums';
const LIST_KEY = 'list';

export const useGetAlbums = (page: number) => {
  const query = useQuery({
    queryKey: [ALBUMS_KEY, LIST_KEY, page],
    queryFn: () => fetchAlbums(page),
  });

  return { ...query };
};

export const useAddAlbum = () => {
  const queryClient = useQueryClient();

  const key = [ALBUMS_KEY, LIST_KEY, 1];
  const globalKey = [ALBUMS_KEY, LIST_KEY];

  const mutation = useMutation({
    mutationKey: key,
    mutationFn: (album: Album) => createAlbum(album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: globalKey,
      });

      queryClient.setQueryData<{ data: Album[]; totalCount: number }>(
        key,
        (prev) =>
          prev
            ? {
                totalCount: prev.totalCount + 1,
                data: [album, ...prev.data],
              }
            : undefined
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: key }) !== 1) return;
      queryClient.invalidateQueries({ queryKey: globalKey });
    },
  });

  return mutation;
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  const key = [ALBUMS_KEY, LIST_KEY];

  const mutation = useMutation({
    mutationKey: key,
    mutationFn: (album: Album) => updateAlbum(album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });

      queryClient.setQueryData<{ data: Album[]; totalCount: number }>(
        key,
        (prev) =>
          prev
            ? {
                ...prev,
                data: prev.data.map((x) => (x.id === album.id ? album : x)),
              }
            : undefined
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: key }) !== 1) return;
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  return mutation;
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  const key = [ALBUMS_KEY, LIST_KEY];

  const mutation = useMutation({
    mutationFn: (album: Album) => deleteAlbum(album),
    onMutate: async (album) => {
      await queryClient.cancelQueries({
        queryKey: key,
      });

      queryClient.setQueryData<{ data: Album[]; totalCount: number }>(
        key,
        (prev) =>
          prev
            ? {
                totalCount: prev.data.includes(album)
                  ? prev.totalCount - 1
                  : prev.totalCount,
                data: prev.data.filter((x) => x.id !== album.id),
              }
            : undefined
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: key }) !== 1) return;
      queryClient.invalidateQueries({ queryKey: [ALBUMS_KEY, LIST_KEY] });
    },
  });

  return mutation;
};
