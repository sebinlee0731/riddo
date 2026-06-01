export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pageCount }: PaginationProps) {
  return (
    <nav>
      {page} / {pageCount}
    </nav>
  );
}
