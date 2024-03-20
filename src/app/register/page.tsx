import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

async function register(formData: FormData) {
  "use server";

  const email = formData.get("email")?.toString();
  const name = formData.get("name")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !name || !password) {
    return new NextResponse("Missing email, username or password", {
      status: 400,
    });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (exist) {
    return new NextResponse("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

}

export default async function RegisterPage() {
  return (
    <div className="">
      <h1 className="text-lg mb-3 font-bold">Add product</h1>
      <form action={register}>
        <input
          name="email"
          placeholder="Email"
          type="text"
          className="input input-bordered mb-3 w-full "
          required
        />
        <input
          name="name"
          placeholder="Name"
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

        <FormSubmitButton className="btn-block">Register</FormSubmitButton>
      </form>
    </div>
  );
}
