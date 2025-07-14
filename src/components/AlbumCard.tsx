import { Link } from 'react-router-dom';
import type { Album } from '../api/core';

interface Props {
  album: Album;
  username: string;
}

export const AlbumCard = ({ album, username }: Props) => {
  return (
    <div className="album-card">
      {album.id > 0 || typeof album.id === 'string' ? (
        <Link to={`/albums/${album.id}`} className="album-card">
          <h3>{album.title}</h3>
          <p>by {username}</p>
        </Link>
      ) : (
        <div style={{ opacity: 0.6 }} className="album-card">
          <h3>{album.title}</h3>
          <p>by {username}</p>
        </div>
      )}
    </div>
  );
};
