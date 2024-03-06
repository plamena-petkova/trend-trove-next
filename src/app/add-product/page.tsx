import FormSubmitButton from "@/components/FormSubmitButton";
import prisma from "../../lib/db/prisma";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "Add product - Trend Trove",
};

async function addProduct(formData: FormData) {
  "use server";

  const session  = await getServerSession(authOptions);

  if(!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price"));

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missinf required fields!");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });

  redirect("/");
}

export default async function AddProductPage() {

  const session = await getServerSession(authOptions);

  if(!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div className="">
      <h1 className="text-lg mb-3 font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          name="name"
          placeholder="Name"
          type="text"
          className="input input-bordered mb-3 w-full "
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="textarea textarea-bordered mb-3 w-full"
        ></textarea>
        <input
          name="imageUrl"
          placeholder="imageUrl"
          type="url"
          className="input input-bordered mb-3 w-full "
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="input input-bordered mb-3 w-full "
          required
        />
        <FormSubmitButton className="btn-block">Add product</FormSubmitButton>
      </form>
    </div>
  );
}
