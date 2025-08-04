import { useSearchParams } from 'react-router-dom';

interface Props {
  totalCount: number;
  limit: number;
}

export const Pagination = ({ totalCount, limit }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') ?? '1');
  const totalPages = Math.ceil(totalCount / limit);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setSearchParams({ page: page.toString() })}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
