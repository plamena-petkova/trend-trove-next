import ProductCard from "@/components/ProductCard"
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next"

export const runtime = 'nodejs'
//export const revlidate = 0;
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface SearchPageProps{
    searchParams: {query:string} 
}

export function generateMetadata({
    searchParams:{query},
}:SearchPageProps): Metadata {
    return {
        title:`Search ${query} - TrendTrove`,
    };
};


export default async function SearchPage({searchParams : {query}}: SearchPageProps) {
    const products = await prisma?.product.findMany({
        where:{
            OR:[
                {name:{contains: query, mode:"insensitive"}},
                {description:{contains: query, mode:"insensitive"}},
            ]
        },
        orderBy:{id:"desc"}
    })

    if(products?.length === 0) {
       return <div className="text-center">No products found</div>
    }

    return(
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products?.map(product => (
                <ProductCard product={product} key={product.id} />
            ))
            }
        </div>
    )

}; 