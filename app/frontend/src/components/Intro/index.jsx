import React from "react";

import heroLogoImgUrl from "../../assets/hero-logo.png";
import mobileLogo from "../../assets/logo-alfa.png";

import "./styles.scss";

export const Intro = () => {
  return (
    <React.Fragment>
      <div className="mobile-intro">
        <img className="mobile-logo" src={mobileLogo} alt="Campo Eventos" />
      </div>
      <div className="desktop-intro">
        <img className="desktop-img" src={heroLogoImgUrl} alt="Campo Eventos" />
      </div>
    </React.Fragment>
  );
};
