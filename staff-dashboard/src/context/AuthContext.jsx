import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        sessionStorage.removeItem("user");
      }
    }

    setAuthReady(true);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("activePage");
    setUser(null);
  };

  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        authReady,
        login,
        logout,
        isReception: role === "RECEPTION",
        isDoctor: role === "DOCTOR",
        isNurse: role === "NURSE",
        isMedical: role === "DOCTOR" || role === "NURSE",
        isPatient: role === "PATIENT",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}