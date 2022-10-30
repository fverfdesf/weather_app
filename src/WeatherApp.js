// STEP 1：從 react 中載入 useCallback
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react"; //套件有問題 無法套用在styled component
import WeatherCard from "./WeatherCard";
import ThemeSwitch from "./ThemeSwitch";
import useWeatherApi from "./useWeatherApi";
import WeatherSetting from "./WeatherSetting";
import { findLocation } from "./utils.js";

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
`;

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const WeatherApp = () => {
  console.log("--- invoke function component1 ---");
  const storageCity = localStorage.getItem("cityName") || "臺北市";
  const [WeatherTheme, setWeatherTheme] = useState("light");
  let [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = findLocation(currentCity) || {};
  console.log(currentLocation);
  const [weatherElement, setWeatherElement, fetchData] = useWeatherApi();
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  let { cityName, sunriseCityName } = currentLocation;
  console.log(WeatherTheme);
  return (
    <ThemeProvider theme={theme[WeatherTheme]}>
      <Container>
        <ThemeSwitch
          setWeatherTheme={setWeatherTheme}
          WeatherTheme={WeatherTheme}
        />
        {currentPage === "WeatherCard" && (
          <WeatherCard
            weatherElement={weatherElement}
            fetchData={fetchData}
            currentLocation={currentLocation}
            setWeatherTheme={setWeatherTheme}
            WeatherTheme={WeatherTheme}
            setCurrentPage={setCurrentPage}
            cityName={cityName}
            sunriseCityName={sunriseCityName}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            setCurrentPage={setCurrentPage}
            currentCity={currentCity}
            setCurrentCity={setCurrentCity}
            fetchData={fetchData}
            cityName={cityName}
            sunriseCityName={sunriseCityName}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
