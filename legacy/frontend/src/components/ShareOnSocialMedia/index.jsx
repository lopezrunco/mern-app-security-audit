import './styles.scss';

export const ShareOnSocialMedia = ({ url }) => {
  const generateShareUrl = (platform) => {
    const platforms = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
      linkedIn: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
    };
    return platforms[platform] || '';
  };

  const shareOnSocial = (platform) => {
    const shareUrl = generateShareUrl(platform);
    if (shareUrl) {window.open(shareUrl, '_blank');}
  };

  return (
    <div className="social-share">
      <a onClick={() => shareOnSocial('facebook')}><i className="fab fa-facebook"></i></a>
      <a onClick={() => shareOnSocial('twitter')}><i className="fa-brands fa-x-twitter"></i></a>
      <a onClick={() => shareOnSocial('linkedIn')}><i className="fab fa-linkedin-in"></i></a>
      <a onClick={() => shareOnSocial('whatsapp')}><i className="fab fa-whatsapp"></i></a>
    </div>
  );
};
