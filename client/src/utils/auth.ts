const API_URL = 'http://localhost:1337'; // Change to your Strapi server URL

interface LoginResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

// Add a logout function to your auth utility
export const logout = (): void => {
    localStorage.removeItem('token');
  };
  

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.jwt);
      return { ok: true, data };
    } else {
      if (response.status === 429) {
        return { ok: false, error: 'Too many login attempts. Please try again later.' };
      }
      return { ok: false, error: data.message || 'Username or Password is incorrect' };
    }
  } catch (error) {
    return { ok: false, error: error.message };
  }
};

export const forgotPassword = async (email: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { ok: true, data };
    } else {
      return { ok: false, error: data.message || 'An error occurred' };
    }
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
