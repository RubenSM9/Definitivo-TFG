// pages/dashboard.js
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Dashboard() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  return <h1>Bienvenido al panel, {user.email}</h1>;
}
