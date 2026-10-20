const getISTParts = (date = new Date()) => {
  const istString = date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString);
};
const isWithinISTWindow = (startHour, endHour) => {
  const now = getISTParts();
  const hour = now.getHours();
  return hour >= startHour && hour < endHour;
};
const startOfMonth = () => {
  const now = getISTParts();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};
const startOfToday = () => {
  const now = getISTParts();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const generateLetterPassword = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
  return password;
};
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendMail = async ({ to, subject, text }) => {
  console.log("====== EMAIL SIMULATION ======");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log(text);
  console.log("==============================");
  return true;
};
const parseLoginEnvironment = (req) => {
  const ua = req.headers["user-agent"] || "";
  const browser = /Chrome/i.test(ua) && !/Edg/i.test(ua) ? "Google Chrome" : /Firefox/i.test(ua) ? "Firefox" : /Safari/i.test(ua) ? "Safari" : /Edg/i.test(ua) ? "Edge" : "Other";
  const os = /Windows/i.test(ua) ? "Windows" : /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" : /Mac OS/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "Other";
  const deviceType = /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop/laptop";
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || req.ip || "Unknown";
  return { browser, os, deviceType, ip, userAgent: ua };
};
module.exports = { isWithinISTWindow, startOfMonth, startOfToday, generateLetterPassword, generateOtp, sendMail, parseLoginEnvironment };
