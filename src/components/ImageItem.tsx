import React from 'react';

interface Props {
  src: string;
  alt?: string;
  author: string;
}

const ImageItem: React.FC<Props> = ({ src, alt = 'Pexels Image', author }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 8,
    }}
  >
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    />
    <span style={{ marginTop: 4, fontSize: 14, color: '#555' }}>
      Photo by {author} on Pexels
    </span>
  </div>
);

export default ImageItem;
