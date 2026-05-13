export const Title = ({ title, subtitle }) => {
  return (
    <div className="row section-title">
      <div className="col">
        <h6>{title}</h6>
        <p className="subtitle">{subtitle}</p>
        <div className="separator"></div>
      </div>
    </div>
  );
};
