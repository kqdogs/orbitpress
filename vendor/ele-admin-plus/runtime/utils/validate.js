const phoneReg = /^1\d{10}$/;
const phoneStrongReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
const telReg = /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
const emailReg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const urlReg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;
const identityReg = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;
const dateReg = /^(\d{4})[-/](\d{1}|0\d{1}|1[0-2])([-/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;
const numberReg = /^[0-9]+\.?[0-9]*$/;
const integerReg = /^-?\d+$/;
const positiveIntegerReg = /^[1-9]\d*$/;
const negativeIntegerReg = /^-[1-9]\d*$/;
const nonNegativeIntegerReg = /^\d+$/;
const nonPositiveIntegerReg = /^-[1-9]\d*|0/;
const chineseReg = /^[\u4E00-\u9FA5]{2,4}$/;
const portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
const longitudeReg = /^[-|+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/;
const latitudeReg = /^[-|+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/;
function isPhone(value) {
  return phoneReg.test(value);
}
function isPhoneStrong(value) {
  return phoneStrongReg.test(value);
}
function isTel(value) {
  return telReg.test(value);
}
function isEmail(value) {
  return emailReg.test(value);
}
function isUrl(value) {
  return urlReg.test(value);
}
function isIdentity(value) {
  return identityReg.test(value);
}
function isDate(value) {
  return dateReg.test(value);
}
function isNumber(value) {
  return numberReg.test(value);
}
function isInteger(value) {
  return integerReg.test(value);
}
function isPositiveInteger(value) {
  return positiveIntegerReg.test(value);
}
function isNegativeInteger(value) {
  return negativeIntegerReg.test(value);
}
function isNonNegativeInteger(value) {
  return nonNegativeIntegerReg.test(value);
}
function isNonPositiveInteger(value) {
  return nonPositiveIntegerReg.test(value);
}
function isChinese(value) {
  return chineseReg.test(value);
}
function isPort(value) {
  return portReg.test(value);
}
function isIP(value) {
  return ipReg.test(value);
}
function isLongitude(value) {
  return longitudeReg.test(value);
}
function isLatitude(value) {
  return latitudeReg.test(value);
}
function maxMinLength(value, minLength, maxLength) {
  if (value == null) {
    return !minLength;
  }
  if (minLength && value.toString().length < minLength) {
    return false;
  }
  return !(maxLength != null && value.toString().length > maxLength);
}
function maxMin(value, min, max) {
  if (value == null) {
    return min == null;
  }
  if (min != null && value < min) {
    return false;
  }
  return !(max != null && value > max);
}
function isIdentityStrong(value) {
  if (!isIdentity(value)) {
    return "身份证号码格式错误";
  }
  const ai = value.length === 18 ? value.substring(0, 17) : `${value.substring(0, 6)}19${value.substring(6, 15)}`;
  const year = ai.substring(6, 10);
  const birthday = `${year}/${ai.substring(10, 12)}/${ai.substring(12, 14)}`;
  if (!isDate(birthday)) {
    return "身份证号码出生日期无效";
  }
  const now = /* @__PURE__ */ new Date();
  if (now.getFullYear() - Number.parseInt(year) > 150 || now.getTime() - new Date(birthday).getTime() < 0) {
    return "身份证号码出生日期不在有效范围";
  }
  const areaCodes = [
    "11",
    "12",
    "13",
    "14",
    "15",
    "21",
    "22",
    "23",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "50",
    "51",
    "52",
    "53",
    "54",
    "61",
    "62",
    "63",
    "64",
    "65",
    "71",
    "81",
    "82",
    "91"
  ];
  if (areaCodes.indexOf(ai.substring(0, 2)) === -1) {
    return "身份证号码地区编码错误";
  }
  if (value.length === 18) {
    const valCode = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let totalMulAiWi = 0;
    for (let i = 0; i < 17; i++) {
      totalMulAiWi += Number.parseInt(ai.charAt(i)) * wi[i];
    }
    if (value !== ai + valCode[totalMulAiWi % 11]) {
      return "身份证号码最后一位错误";
    }
  }
}
export {
  chineseReg,
  dateReg,
  emailReg,
  identityReg,
  integerReg,
  ipReg,
  isChinese,
  isDate,
  isEmail,
  isIP,
  isIdentity,
  isIdentityStrong,
  isInteger,
  isLatitude,
  isLongitude,
  isNegativeInteger,
  isNonNegativeInteger,
  isNonPositiveInteger,
  isNumber,
  isPhone,
  isPhoneStrong,
  isPort,
  isPositiveInteger,
  isTel,
  isUrl,
  latitudeReg,
  longitudeReg,
  maxMin,
  maxMinLength,
  negativeIntegerReg,
  nonNegativeIntegerReg,
  nonPositiveIntegerReg,
  numberReg,
  phoneReg,
  phoneStrongReg,
  portReg,
  positiveIntegerReg,
  telReg,
  urlReg
};
