
import { useState } from "react";
import axios from "axios";
import { getAuthCsrfToken } from "../services/auth";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = await getAuthCsrfToken();
      await axios.post("/api/users", { user: form }, {
        headers: { "X-CSRF-Token": csrfToken },
      });
      setMessage("Account created successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.errors?.full_messages?.join(", ") ||
        error.response?.data?.errors?.join(", ") ||
        "Sign-up failed. Please check your details."
      );
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Sign up to manage your tasks</p>

        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        <button type="submit">Sign Up</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
