
import api from "./api";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const data = response.data;

    if (!data.token) {
      throw new Error("Login response did not contain a token.");
    }

    // Save the JWT token.
    localStorage.setItem("token", data.token);

    // Support both nested and flat backend responses.
    const user = data.user ?? {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
    };

    if (!user.role) {
      throw new Error("Login response did not contain a user role.");
    }

    // Save the user for ProtectedRoute.jsx.
    localStorage.setItem("user", JSON.stringify(user));

    return {
      ...data,
      user,
    };
  },

  register: (userData) => api.post("/auth/register", userData),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => api.get("/auth/me"),
};
