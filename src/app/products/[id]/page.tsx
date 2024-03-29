import NotFoundPage from "@/app/not-found";
import {prisma} from "../../../lib/db/prisma";
import Image from "next/image";
import PriceTag from "@/components/PriceTag";
import { Metadata } from "next";
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import incrementProductQuantity from "./actions";

export const runtime = 'nodejs'
//export const revlidate = 0;
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface ProductPageProps {
  params: {
    id: string;
  };
}

//Prevent two database operations with caching
const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    NotFoundPage();
  } else {
    return product;
  }
});

export async function generateMetadata({
  params: { id },
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product?.name + "- TrendTrove",
    description: product?.description,
    //openGraph: {
    //   images: [{url:product?.imageUrl}]
    //}
  };
}

export default async function ProductPage({
  params: { id },
}: ProductPageProps) {
  const product = await getProduct(id);

  if (product) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <Image
          priority
          src={product.imageUrl}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-lg"
        />
        <div className="">
          <h1 className="text-5xl font-bold">{product.name}</h1>
          <PriceTag price={product.price} className="mt-4" />
          <p className="py-6">{product.description}</p>
          <AddToCartButton
            productId={product.id}
            incrementProductQuantity={incrementProductQuantity}
          />
        </div>
      </div>
    );
  }
}
