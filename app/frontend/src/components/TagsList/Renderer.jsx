export const Renderer = ({ tagsList }) => (
    <div className="tag-list">
        <h4>Etiquetas</h4>
        <div className="separator"></div>
        {tagsList.length === 0 ? (
            <p>No hay etiquetas que mostrar</p>
        ) : (
            tagsList.map((tag, i) =>
                <a href={`/articulos/etiqueta/${tag}`} key={i}>
                    {tag}
                </a>
            )
        )}
    </div>
)