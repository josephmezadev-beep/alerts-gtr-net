export async function handler(event: any) {
  try {
    const { url } = event.queryStringParameters || {};

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing URL" }),
      };
    }

    const authHeader =
      event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing Authorization header" }),
      };
    }

    // 🔥 NUEVO: detectar método dinámicamente
    const method = event.httpMethod || "GET";

    const options: any = {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    };

    // 🔥 NUEVO: reenviar body si es POST / PUT
    if (method !== "GET" && event.body) {
      options.body = event.body;
    }

    const response = await fetch(url, options);

    const text = await response.text();

    return {
      statusCode: response.status,
      body: text,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
}