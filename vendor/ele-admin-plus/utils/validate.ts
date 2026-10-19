/** 格式校验工具 */

/**
 * 手机号正则表达式
 */
export const phoneReg = /^1\d{10}$/;

/**
 * 手机号正则表达式(强校验)
 */
export const phoneStrongReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;

/**
 * 固话正则表达式
 */
export const telReg =
  /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;

/**
 * 邮箱正则表达式
 */
export const emailReg =
  /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

/**
 * 网址正则表达式
 */
export const urlReg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/;

/**
 * 身份证正则表达式
 */
export const identityReg = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/;

/**
 * 日期正则表达式
 */
export const dateReg =
  /^(\d{4})[-/](\d{1}|0\d{1}|1[0-2])([-/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/;

/**
 * 数字正则表达式
 */
export const numberReg = /^[0-9]+\.?[0-9]*$/;

/**
 * 整数正则表达式
 */
export const integerReg = /^-?\d+$/;

/**
 * 正整数正则表达式
 */
export const positiveIntegerReg = /^[1-9]\d*$/;

/**
 * 负整数正则表达式
 */
export const negativeIntegerReg = /^-[1-9]\d*$/;

/**
 * 非负整数(正整数或0)正则表达式
 */
export const nonNegativeIntegerReg = /^\d+$/;

/**
 * 非正整数(负整数或0)正则表达式
 */
export const nonPositiveIntegerReg = /^-[1-9]\d*|0/;

/**
 * 中文正则表达式
 */
export const chineseReg = /^[\u4E00-\u9FA5]{2,4}$/;

/**
 * 端口号正则表达式
 */
export const portReg =
  /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

/**
 * IP 正则表达式
 */
export const ipReg =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

/**
 * 经度正则表达式, -180.0 ~ +180.0(整数部分为 0 ~ 180 , 必须输入 1 到 5 位小数)
 */
export const longitudeReg =
  /^[-|+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/;

/**
 * 纬度正则表达式, -90.0 ~ +90.0(整数部分为 0 ~ 90, 必须输入 1 到 5 位小数)
 */
export const latitudeReg = /^[-|+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/;

/**
 * 是否是手机号
 * @param value
 */
export function isPhone(value: string): boolean {
  return phoneReg.test(value);
}

/**
 * 是否是手机号(强校验)
 * @param value
 */
export function isPhoneStrong(value: string): boolean {
  return phoneStrongReg.test(value);
}

/**
 * 是否为固话
 * @param value
 */
export function isTel(value: string): boolean {
  return telReg.test(value);
}

/**
 * 是否是邮箱
 * @param value
 */
export function isEmail(value: string): boolean {
  return emailReg.test(value);
}

/**
 * 是否是网址
 * @param value
 */
export function isUrl(value: string): boolean {
  return urlReg.test(value);
}

/**
 * 是否是身份证
 * @param value
 */
export function isIdentity(value: string): boolean {
  return identityReg.test(value);
}

/**
 * 是否是日期
 * @param value
 */
export function isDate(value: string): boolean {
  return dateReg.test(value);
}

/**
 * 是否是数字
 * @param value
 */
export function isNumber(value: string): boolean {
  //return !isNaN(value);
  return numberReg.test(value);
}

/**
 * 是否是整数
 * @param value
 */
export function isInteger(value: string): boolean {
  return integerReg.test(value);
}

/**
 * 是否是正整数
 * @param value
 */
export function isPositiveInteger(value: string): boolean {
  return positiveIntegerReg.test(value);
}

/**
 * 是否是负整数
 * @param value
 */
export function isNegativeInteger(value: string): boolean {
  return negativeIntegerReg.test(value);
}

/**
 * 是否是非负整数(正整数或 0)
 * @param value
 */
export function isNonNegativeInteger(value: string): boolean {
  return nonNegativeIntegerReg.test(value);
}

/**
 * 是否是非正整数(负整数或 0)
 * @param value
 */
export function isNonPositiveInteger(value: string): boolean {
  return nonPositiveIntegerReg.test(value);
}

/**
 * 是否是中文
 * @param value
 */
export function isChinese(value: string): boolean {
  return chineseReg.test(value);
}

/**
 * 是否是端口号
 * @param value
 */
export function isPort(value: string): boolean {
  return portReg.test(value);
}

/**
 * 是否是 IP
 * @param value
 */
export function isIP(value: string): boolean {
  return ipReg.test(value);
}

/**
 * 是否是经度, -180.0 ~ +180.0(整数部分为 0 ~ 180 , 必须输入 1 到 5 位小数)
 * @param value
 */
export function isLongitude(value: string): boolean {
  return longitudeReg.test(value);
}

/**
 * 是否是纬度, -90.0 ~ +90.0(整数部分为 0 ~ 90 , 必须输入 1 到 5 位小数)
 * @param value
 */
export function isLatitude(value: string): boolean {
  return latitudeReg.test(value);
}

/**
 * 验证最小长度, 最大长度
 * @param value
 * @param minLength
 * @param maxLength
 */
export function maxMinLength(
  value: string,
  minLength?: number,
  maxLength?: number
): boolean {
  if (value == null) {
    return !minLength;
  }
  if (minLength && value.toString().length < minLength) {
    return false;
  }
  return !(maxLength != null && value.toString().length > maxLength);
}

/**
 * 验证最小值, 最大值
 * @param value
 * @param min
 * @param max
 */
export function maxMin(value: number, min?: number, max?: number): boolean {
  if (value == null) {
    return min == null;
  }
  if (min != null && value < min) {
    return false;
  }
  return !(max != null && value > max);
}

/**
 * 是否是身份证(强校验)
 * @param value
 */
export function isIdentityStrong(value: string): string | null | undefined {
  if (!isIdentity(value)) {
    return '身份证号码格式错误';
  }
  const ai =
    value.length === 18
      ? value.substring(0, 17)
      : `${value.substring(0, 6)}19${value.substring(6, 15)}`;
  // 验证出生年月
  const year = ai.substring(6, 10); // 年
  const birthday = `${year}/${ai.substring(10, 12)}/${ai.substring(12, 14)}`;
  if (!isDate(birthday)) {
    return '身份证号码出生日期无效';
  }
  const now = new Date();
  if (
    now.getFullYear() - Number.parseInt(year) > 150 ||
    now.getTime() - new Date(birthday).getTime() < 0
  ) {
    return '身份证号码出生日期不在有效范围';
  }
  // 验证地区码
  const areaCodes = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '21',
    '22',
    '23',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '50',
    '51',
    '52',
    '53',
    '54',
    '61',
    '62',
    '63',
    '64',
    '65',
    '71',
    '81',
    '82',
    '91'
  ];
  if (areaCodes.indexOf(ai.substring(0, 2)) === -1) {
    return '身份证号码地区编码错误';
  }
  // 验证最后一位
  if (value.length === 18) {
    const valCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let totalMulAiWi = 0;
    for (let i = 0; i < 17; i++) {
      totalMulAiWi += Number.parseInt(ai.charAt(i)) * wi[i];
    }
    if (value !== ai + valCode[totalMulAiWi % 11]) {
      return '身份证号码最后一位错误';
    }
  }
}
