import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { ReactComponent as Sun } from "./images/sun.svg";
import { ReactComponent as Moon } from "./images/moon.svg";

const SwitchContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  svg {
    width: 25px;
    height: auto;
    cursor: pointer;
  }
`;

const MoonIcon = styled(Moon)`
  fill: "#f40";
`;

const ThemeSwitch = ({ setWeatherTheme, WeatherTheme }) => {
  function clickHandler() {
    let darkAndTheme = WeatherTheme === "light" ? "dark" : "light";
    setWeatherTheme(darkAndTheme);
    localStorage.setItem("theme", darkAndTheme);
  }

  return (
    <SwitchContainer>
      {WeatherTheme === "light" ? (
        <MoonIcon onClick={clickHandler} />
      ) : (
        <Sun onClick={clickHandler} />
      )}
    </SwitchContainer>
  );
};

export default ThemeSwitch;
