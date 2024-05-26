import Pagination from 'react-bootstrap/Pagination';
import { LinkContainer } from 'react-router-bootstrap';

function PaginationComponent({ totalPages, pageNum, searchQuery, categoryName }) {

  const category = categoryName ? `category/${categoryName}` : "";
  const search = searchQuery ? `search/${searchQuery}` : "";
  const url = `/product-list/${category}${search}`;

  return (
    <Pagination>
      <LinkContainer to={`${url}/${pageNum - 1}`}>
        <Pagination.Prev disabled={pageNum === 1} />
      </LinkContainer>

      {
        Array.from({ length: totalPages }).map((_, _idx) => {
          return <LinkContainer key={_idx} to={`${url}/${_idx + 1}`}>
            <Pagination.Item active={pageNum === _idx + 1}>{_idx + 1}</Pagination.Item>
          </LinkContainer>

        })
      }

      <LinkContainer to={`${url}/${pageNum +1}`}>
        <Pagination.Next disabled={pageNum=== totalPages} />
      </LinkContainer>

    </Pagination>
  );
}

export default PaginationComponent;