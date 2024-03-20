import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import FormSubmitButton from "@/components/FormSubmitButton";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signIn } from "next-auth/react";


async function login(formData: FormData) {
  "use server";

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const data = { email, password};

  if (!email || !password) {
    return new NextResponse("Missing email, username or password", {
      status: 400,
    });
  }

  //signIn('credentials', data, redirect("/"))


}

export default function LoginPage() {
  return (
    <div className="">
      <h1 className="text-lg mb-3 font-bold">Login</h1>
      <form action={login}>
        <input
          name="email"
          placeholder="Email"
          type="text"
          className="input input-bordered mb-3 w-full "
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="input input-bordered mb-3 w-full "
          required
        />
        <FormSubmitButton className="btn-block">Login</FormSubmitButton>
      </form>
    </div>
  );
}
