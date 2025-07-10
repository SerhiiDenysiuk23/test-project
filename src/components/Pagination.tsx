interface Props {
  currentPage: number;
  totalCount: number;
  limit: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalCount,
  limit,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / limit);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}
    </div>
  );
};
