"use client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const { email, password, name } = values;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Registration Successful", response);
      try {
        const response: any = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        console.log({ response });
        if (!response?.error) {
          router.push("/");
          router.refresh();
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Login Successful", response);
      } catch (error: any) {
        console.error("Login Failed:", error);
      }
    } catch (error: any) {
      console.error("Registration Failed:", error);
    }
  };

  const changeHandler = (e: any) => {
    setValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="">
      <h1 className="text-lg mb-3 font-bold">Register</h1>
      <form onSubmit={handleRegister}>
        <input
          name="email"
          placeholder="Email"
          type="text"
          className="input input-bordered mb-3 w-full "
          required
          value={values.email}
          onChange={changeHandler}
        />
        <input
          name="name"
          placeholder="Name"
          type="text"
          className="input input-bordered mb-3 w-full "
          required
          value={values.name}
          onChange={changeHandler}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="input input-bordered mb-3 w-full "
          required
          value={values.password}
          onChange={changeHandler}
        />
        <FormSubmitButton className="btn-block">Register</FormSubmitButton>
      </form>
    </div>
  );
}
