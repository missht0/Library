import dayjs from "dayjs";
import UTC from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import RelativeTime from "dayjs/plugin/relativeTime";
import Duration from "dayjs/plugin/duration";
import zh from "dayjs/locale/zh-cn";
import en from "dayjs/locale/en";

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.extend(RelativeTime);
dayjs.extend(Duration);

export const exchangeTime = (time, locale, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(time).isValid() ? dayjs(time).tz(dayjs.tz.guess()).format(format) : null;
};
export const exchangeTimeSSS = (time, locale, format = "YYYY-MM-DD HH:mm:ss:SSS") => {
  return dayjs(time).isValid() ? dayjs(time).tz(dayjs.tz.guess()).format(format) : null;
};

export const getRelativeTime = (time, locale, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(time).isValid() ? dayjs(time).fromNow() : null;
};

export const getDiffTime = (startTime, endTime, locale, format = "YYYY-MM-DD HH:mm:ss") => {
  const lng = localStorage.getItem("i18nextLng") ?? "en_US";
  if (dayjs(startTime).isValid() && dayjs(endTime)) {
    const result = dayjs(endTime).locale(localeEnum[lng]).diff(startTime, "second");
    const hour = parseInt(result / 3600);
    const minute = parseInt((result - hour * 3600) / 60);
    const second = result - hour * 3600 - minute * 60;
    return dayjs
      .duration({
        seconds: second,
        minutes: minute,
        hours: hour,
      })
      .format(locale ?? "HH:mm:ss");
  } else {
    return null;
  }
};

/**
 * @description 项目中复用到的工具方法
 */

/* 判断数据是否存在 */
export function isDataExist(res) {
  if (res.status >= 200 && res.status < 300) {
    return true;
  }
  if (res) {
    if (res.data) {
      if (res.data.data) return true;
    }
  }
  return false;
}

/* 关于解析路径上的query传参 */
export function initSearchQuery(search) {
  let i_search = search;
  const data = {};
  if (i_search.split("?").length > 1) {
    i_search = i_search.split("?")[1];
    if (search.indexOf("&") > -1) {
      i_search = i_search.split("&");
      i_search.map((item) => {
        const per = item.split("=");
        data[per[0]] = per[1];
        return item;
      });
    } else {
      i_search = i_search.split("=");
      data[i_search[0]] = i_search[1];
    }
    return data;
  }
  return {};
}

/* 关于cookie */
export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(`${c_name}=`);
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      let c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) c_end = document.cookie.length;
      return document.cookie.substring(c_start, c_end);
    }
  }
  return null;
}

export function setCookie(name, value, seconds, domain) {
  const second = seconds || 0; // seconds有值就直接赋值，没有为0
  let expires = "";
  if (second !== 0) {
    // 设置cookie生存时间
    const date = new Date();
    date.setTime(date.getTime() + second * 1000);
    expires = `; expires=${date.toGMTString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/;${domain ? "domain=" + domain : ""} ; `; // 转码并赋值
}

export function clearCookie(name) {
  setCookie(name, "");
  setCookie("isChecked", false);
}

/* eslint-disable */
// ----------------------------------------------------------------------

export default function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
