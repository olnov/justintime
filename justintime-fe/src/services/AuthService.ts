const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (email:string, passsword:string) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: passsword })
    };

    const response = await fetch(`${BACKEND_URL}/auth/login`, requestOptions);
    if (!response.ok) {
        throw new Error('Failed to login');
    }else{
        const data = await response.json();
        return data;
    }
};


export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payloadStr = base64UrlDecodeToString(token.split(".")[1]);
      const payload = JSON.parse(payloadStr);
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }
  return false;
};

export const parseToken = (token: string) => {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    const payloadJson = base64UrlDecodeToString(parts[1]);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};


// Polyfill for base64url decoding
function base64UrlDecodeToString(base64Url: string): string {
  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(base64Url.length / 4) * 4, '=');

  const raw = window
    .atob(base64)
    .split('')
    .map(char => char.charCodeAt(0));

  const byteArray = new Uint8Array(raw);
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(byteArray);
}

