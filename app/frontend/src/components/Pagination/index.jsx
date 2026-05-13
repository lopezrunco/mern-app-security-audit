function Pagination({
  elementList,
  currentPage,
  prevPageFunction,
  nextPageFunction,
}) {
  return (
    <div className="col-12">
      <div className="pagination">
        {currentPage > 1 && (
          <button
            className="button button-light me-3"
            onClick={() => prevPageFunction()}
          >
            <i className="fa fa-chevron-left"></i> Anterior
          </button>
        )}
        {currentPage < elementList.length && (
          <button
            className="button button-light"
            onClick={() => nextPageFunction()}
          >
            Siguiente <i className="fa fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
