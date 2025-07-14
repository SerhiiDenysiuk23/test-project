export interface Album {
  userId: number | number;
  id: number | number;
  title: string;
}
export interface User {
  id: number | number;
  username: string;
}
export interface Photo {
  albumId: number | number;
  id: number | number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const BASE = 'http://localhost:3000';

const request = async (
  route: string,
  method: 'GET' | 'POST',
  body?: BodyInit | null
) => {
  const res = await fetch(`${BASE + route}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!res.ok)
    throw new Error(`${method === 'GET' ? 'Fetch' : 'Mutate'} error.`);

  return await res.json();
};

export const fetchAlbums = async (
  page: number,
  limit: number
): Promise<{ data: Album[]; totalCount: number }> => {
  let data: Album[] = await request('/albums', 'GET');

  const totalCount = data.length;

  data = data.reverse();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return { data: paginatedData, totalCount };
};

export const fetchUsers = async (): Promise<User[]> => {
  return await request('/users', 'GET');
};

export const fetchPhotosByAlbum = async (albumId: string): Promise<Photo[]> => {
  return await request(`/photos?albumId=${albumId}`, 'GET');
};

export const createAlbum = async (
  title: string,
  userId: number
): Promise<Album> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

  return await request('/albums', 'POST', JSON.stringify({ title, userId }));
};

export const createPhoto = async (
  albumId: number,
  title: string,
  url: string,
  thumbnailUrl: string
): Promise<Photo> => {
  return await request(
    '/photos',
    'POST',
    JSON.stringify({ albumId, title, url, thumbnailUrl })
  );
};
