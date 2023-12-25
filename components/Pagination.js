import { useMemo } from 'react'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'

const PaginationLinks = ({ page, setPage, total }) => {
  const pages = useMemo(() => {
    return [...Array(total).keys()]
  }, [total])

  const maxPaginationSteps = 2
  return (
    <div className="d-flex justify-content-center mt-5">
      <Pagination aria-label="Page navigation example">
        <PaginationItem className={page <= 1 ? 'disabled' : ''}>
          <PaginationLink
            first
            href="#"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          />
        </PaginationItem>
        {pages.map(p =>
          page === p + 1 ||
          (page + maxPaginationSteps >= p + 1 && page <= p + 1) ||
          (page - maxPaginationSteps <= p + 1 && page >= p + 1) ? (
            <PaginationItem active={p + 1 === page} key={p}>
              <PaginationLink href="#" onClick={() => setPage(p + 1)}>
                {p + 1}
              </PaginationLink>
            </PaginationItem>
          ) : (
            ''
          )
        )}
        <PaginationItem className={page >= total ? 'disabled' : ''}>
          <PaginationLink last href="#" onClick={() => setPage(p => p + 1)} />
        </PaginationItem>
      </Pagination>
    </div>
  )
}

export default PaginationLinks
