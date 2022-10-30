import React, { useState, useEffect, useCallback, useMemo } from "react";
const fetchCurrentWeather = (sunriseCityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&locationName=${sunriseCityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};

const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-507B37E0-0383-4D8C-878D-628B54EC3536&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};
const filterSunriseAndSunset = async (cityName) => {
  let filterData = [];
  const sunApi = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/A-B0062-001?Authorization=CWB-0B68D1A2-6FC4-4289-B1B1-5C3AF221E320&format=JSON&locationName=${cityName}&timeFrom=2022-09-25&sort=dataTime`;
  console.log("aaaa", sunApi);
  let response = await fetch(sunApi, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  let data = await response.json();

  let timeArr = data.records.locations.location[0].time;
  console.log(timeArr);
  timeArr.forEach((data) => {
    let sunRise_sunSet_filter = data.parameter.filter(
      ({ parameterName, parameterValue }) => {
        return parameterName === "日出時刻" || parameterName === "日沒時刻";
      }
    );
    filterData.push({ dataTime: data.dataTime, ...sunRise_sunSet_filter });
  });
  return filterData;
};

//取得時間
const getMount = async function (cityName) {
  const taipeiFilterData = await filterSunriseAndSunset(cityName);
  console.log(taipeiFilterData);
  //找出當時間並轉換時間格式，目的是要和請求的資料作比對
  let now = new Date();
  let nowDate = Intl.DateTimeFormat("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .split("/")
    .join("-");
  //找出當前時間氣象資料
  let locationDate = taipeiFilterData.find((data) => data.dataTime === nowDate);
  console.log(locationDate);
  //將日落日出和現在時間轉為時間戳

  let sunRiseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate[0].parameterValue}`
  ).getTime();
  let sunSetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate[1].parameterValue}`
  ).getTime();
  let nowTimestamp = now.getTime();
  if (sunRiseTimestamp <= nowTimestamp && nowTimestamp <= sunSetTimestamp)
    return "day";
  return "night";
};

//componet
const useWeatherApi = () => {
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: "",
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true,
  });

  const fetchData = useCallback((cityName, sunriseCityName) => {
    // STEP 3：把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast, Mount] = await Promise.all([
        fetchCurrentWeather(sunriseCityName),
        fetchWeatherForecast(cityName),
        getMount(cityName),
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        moment: Mount,
        isLoading: false,
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    // STEP 4：一樣記得要呼叫 fetchingData 這個方法
    fetchingData();

    // STEP 5：因為 fetchingData 沒有相依到 React 組件中的資料狀態，所以 dependencies 帶入空陣列
  }, []);

  useEffect(() => {
    console.log("execute function in useEffect");
    let get_City_Name = localStorage.getItem("cityName") || "臺北市";
    fetchData(get_City_Name, get_City_Name[0] + get_City_Name[1]);
    // STEP 6：把透過 useCallback 回傳的函式放到 useEffect 的 dependencies 中
  }, [fetchData]);

  return [weatherElement, setWeatherElement, fetchData];
};

export default useWeatherApi;
