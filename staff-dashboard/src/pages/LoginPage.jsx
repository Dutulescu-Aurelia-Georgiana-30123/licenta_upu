import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        email,
        password,
      });

      const user = res.data;

      // salvăm userul
      localStorage.setItem("user", JSON.stringify(user));

      // redirect pe baza rolului
      if (user.role === "RECEPTION") {
        window.location.href = "/";
      } else if (user.role === "DOCTOR" || user.role === "NURSE") {
        window.location.href = "/medical";
      } else if (user.role === "PATIENT") {
        window.location.href = "/patient";
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}