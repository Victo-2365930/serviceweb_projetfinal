/*Code emprunté de:
https://sentry.io/answers/generate-random-string-characters-in-javascript/#:~:text=Random%20characters%20are%20chosen%20using,random()%20.
*/
function createRandomString() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 28; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { createRandomString };