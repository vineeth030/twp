// src/auth/useAuth.js
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useAuth() {
  const {user, setUser} = useContext(AuthContext);
  const {loading, setLoading} = useContext(AuthContext);

  const token = localStorage.getItem("token");

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return true;
    } else {
      alert(data.message || "Login failed");
      return false;
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, logout };
}
