export interface Album {
  userId: number;
  id: number;
  title: string;
}
export interface User {
  id: number;
  username: string;
}
export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const BASE = 'https://jsonplaceholder.typicode.com';

export const fetchAlbums = async (
  page: number,
  limit: number
): Promise<{ data: Album[]; totalCount: number }> => {
  const res = await fetch(`${BASE}/albums?_page=${page}&_limit=${limit}`);
  const totalCount = Number(res.headers.get('X-Total-Count') || 0);
  const data: Album[] = await res.json();
  return { data, totalCount };
};

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE}/users`);
  return res.json();
};

export const fetchPhotosByAlbum = async (albumId: string): Promise<Photo[]> => {
  const res = await fetch(`${BASE}/photos?albumId=${albumId}`);
  return res.json();
};

export const createAlbum = async (
  title: string,
  userId: number
): Promise<Album> => {
  const res = await fetch(`${BASE}/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, userId }),
  });
  return res.json();
};

export const createPhoto = async (
  albumId: number,
  title: string,
  url: string,
  thumbnailUrl: string
): Promise<Photo> => {
  const res = await fetch(`${BASE}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ albumId, title, url, thumbnailUrl }),
  });
  return res.json();
};
