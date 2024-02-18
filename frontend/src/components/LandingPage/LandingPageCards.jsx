import { Link } from "react-router-dom";

export const LandingPageCard = ({ activeLink, image, alt, path, linkText }) => {
  return (
    <Link to={path} className={activeLink}>
      <div className="landing-card">
        <img className="landing-img" src={image} alt={alt}></img>
        <h4 className={`landing-link ${activeLink}`}>{linkText}</h4>
      </div>
    </Link>
  );
};
