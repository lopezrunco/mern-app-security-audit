import "./styles.scss";

function NoVideoMsj({ msj }) {
  return (
    <div className="no-video-msj">
      <i className="fas fa-video-slash"></i>
      <p>{msj}</p>
    </div>
  );
}

export default NoVideoMsj;
