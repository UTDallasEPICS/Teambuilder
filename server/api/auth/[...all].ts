import { auth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  console.log("Auth route hit:", url.pathname);

  const response = await auth.handler(toWebRequest(event));

  console.log("Auth response status:", response.status);

  for (const [key, value] of response.headers.entries()) {
    appendResponseHeader(event, key, value);
  }

  setResponseStatus(event, response.status);

  if (response.status === 302 || response.status === 301) {
    const location = response.headers.get("location");
    if (location) {
      return sendRedirect(event, location, response.status);
    }
  }

  const text = await response.text();
  console.log("Auth response body:", text);

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
});