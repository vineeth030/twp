import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }

    fetch(`${API_BASE_URL}/api/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        })
    .then(res => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
    })
    .then(data => setUser(data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
