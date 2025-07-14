import { Link } from 'react-router-dom';
import type { Album } from '../api/core';

interface Props {
  album: Album;
  username: string;
  // eslint-disable-next-line no-unused-vars
  onEdit: (album: Album) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (album: Album) => void;
}

export const AlbumCard = ({ album, username, onEdit, onDelete }: Props) => {
  return (
    <div className="album-card">
      {typeof album.id === 'string' || album.id > 0 ? (
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
      <div className="album-actions">
        <button onClick={() => onEdit(album)}>✏️ Edit</button>
        <button onClick={() => onDelete(album)}>🗑 Delete</button>
      </div>
    </div>
  );
};
