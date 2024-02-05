'use client'
import { Chain } from "@covalenthq/client-sdk"
import { usePathname, useRouter } from "next/navigation";
import { XYKPoolListView, XYKTokenListView  } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export default function Pools({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const pathname = usePathname()

  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Pools
        </h1>
        <XYKPoolListView
          chain_name={params.chain}
          dex_name={params.dex}
          page_size={20}
          on_pool_click={(e: any)=>{
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
