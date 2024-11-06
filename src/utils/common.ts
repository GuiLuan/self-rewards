/**
 * 生成随机ID
 * @returns 9位随机ID
 *
 * @example
 * ```
 * genenrateId(); // "5j3x6m"
 * ```
 */
const genenrateId = () => {
  return Math.random().toString(36).substr(2, 9);
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

const isToday = (dateString: string) => {
  const currentDate = new Date();
  const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

  return dateString.slice(0, 10) === today;
};

export { genenrateId, getCurTime, isToday };
