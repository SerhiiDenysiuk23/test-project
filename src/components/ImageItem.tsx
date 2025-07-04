import React from 'react';

interface Props {
  src: string;
  alt?: string;
  author: string;
}

export const ImageItem: React.FC<Props> = ({
  src,
  alt = 'Pexels Image',
  author,
}) => (
  <div className="image-item">
    <img src={src} alt={alt} />
    <div className="image-author">Photo by {author}</div>
  </div>
);
