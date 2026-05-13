export const Renderer = ({ state, clearSearch }) => (
    <div className="confirmation-modal">
        <div className="container">
            <div className="row">
                <div className="content-wrap">
                    <h2 className="mb-4">Búsqueda</h2>
                    {state.hasError && (
                        <p className="text-center">
                            Ocurrió un error al realizar la búsqueda. <br /> Intente
                            refrescando la página e intente de nuevo.
                        </p>
                    )}
                    {state.noResults && (
                        <p className="text-center">
                            Su búsqueda no arrojó ningún resultado. <br /> Intente con
                            otras palabras clave.
                        </p>
                    )}
                    <div className="button button-dark" onClick={clearSearch}>
                        <i className="fas fa-times"></i> Cerrar
                    </div>
                </div>
            </div>
        </div>
    </div>
)