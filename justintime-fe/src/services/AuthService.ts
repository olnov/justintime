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
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        const currentTime = Date.now() / 1000; // Get current time in seconds
        return payload.exp > currentTime; // Check if token is expired
      } catch (error) {
        console.error("Error: ", error);
        return false;
      }
    }
    return false;
  };

export const parseToken = (token:string) => {
    if (token) {
        return JSON.parse(atob(token.split(".")[1]));
    }
    return null;
};