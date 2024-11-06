/**
 * 生成随机ID
 * @returns 27位随机ID
 *
 * @example
 * ```
 * genenrateId(); // "v0bu9y1ud5nnvuzsyu1up5e1e3h"
 * ```
 */
const genenrateId = () => {
  function generateRandomString(length: number) {
    let randomString = "";
    while (randomString.length < length) {
      randomString += Math.random().toString(36).substring(2);
    }
    return randomString.substring(0, length);
  }
  return generateRandomString(27);
};

/**
 * 获取当前时间
 * @returns 格式为“YY-MM-DD HH:mm:ss”
 *
 * @example
 *
 * ```
 * getCurTime(); // "2023-10-01 12:30:45"
 * ```
 */
const getCurTime = () => {
  // 获取当前时间
  const currentDate = new Date();
  // 格式化日期时间
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 判断给定日期字符串是否是今天的日期
 * @param dateString 格式为“YYYY-MM-DD ...”的日期字符串
 * @returns 如果是今天的日期，则返回true，否则返回false
 *
 * @example
 *
 * ```
 * isToday("2023-10-01"); // true
 * isToday("2023-10-01 11:21:19"); // true
 * ```
 */
const isToday = (dateString: string) => {
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
  return dateString.slice(0, 10) === today;
};

export { genenrateId, getCurTime, isToday };
