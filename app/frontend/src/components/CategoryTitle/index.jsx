import "./styles.scss";

export const CategoryTitle = ({ category, link }) => {
  return (
    <div className="category-title">
      <div className="content">
        <h4>{category}</h4>
        <a className="button view-more" href={link}>
        <i className="far fa-folder-open"></i> Ver más
        </a>
      </div>
    </div>
  );
};
