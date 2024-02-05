'use client'
import { usePathname, useRouter } from "next/navigation";
import { XYKTokenListView  } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export default function Tokens({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()

  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Tokens
        </h1>
        <XYKTokenListView
          chain_name={params.chain}
          dex_name={params.dex}
          page_size={20}
          on_token_click={(e: any)=>{
            router.push(`${pathname}/${e}`)
          }}
        />
        <Flex onClick={()=>{
          router.back()
        }}>
          <Button>Back</Button>
        </Flex>
    </div>
  )

}
