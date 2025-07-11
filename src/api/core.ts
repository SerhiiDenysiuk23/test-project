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

export const fetchAlbums = async (
  page: number,
  limit: number
): Promise<{ data: Album[]; totalCount: number }> => {
  const res = await fetch(`${BASE}/albums`);
  const totalCount = 100;
  let data: Album[] = await res.json();

  data = data.reverse();
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return { data: paginatedData, totalCount };
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
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });

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
