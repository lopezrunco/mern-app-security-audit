import './styles.scss';

export const TextBanner = ({ text, bgClass, textClass }) => {
  return (
    <div className={`text-banner ${bgClass}`}>
      <h2 className={`mb-0 ${textClass}`}>{text}</h2>
    </div>
  );
};
