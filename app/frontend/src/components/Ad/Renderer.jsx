import { adAllowedPositions } from "../../config/ad-config";

export const Renderer = ({ state, position }) => {
  const isPositionAllowed = adAllowedPositions.includes(position);

  if (!isPositionAllowed) {
    return <p>Ocurrió un error al cargar el anuncio.</p>;
  }

  if (state.ads.length > 0) {
    const publishedAds = state.ads.filter((ad) => ad.published);
    return (
      <div className="ad">
        {publishedAds.map((ad) => (
          <div key={ad.id} className="text-center my-5 overflow-hidden">
            {ad.link ? (
              <a href={ad.link} target="_blank" rel="noreferrer">
                <img
                  src={ad.imgUrl}
                  alt={ad.title}
                  width="100%"
                  className="sm-border-radius"
                  title={`Visitar ${ad.title}`}
                />
              </a>
            ) : (
              <img
                src={ad.imgUrl}
                alt={ad.title}
                width="100%"
                className="sm-border-radius"
                title={`Visitar ${ad.title}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return null; // If no ads associated
};
