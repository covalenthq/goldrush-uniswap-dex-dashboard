'use client'
import { Chain } from "@covalenthq/client-sdk"
import { useRouter } from "next/navigation";
import { XYKOverviewTimeSeries, XYKOverviewTransactionsListView, XYKPoolListView, XYKTokenListView  } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";

export default function Overview({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Overview
        </h1>
        <div className="flex gap-4">
          <XYKOverviewTimeSeries
            chain_name={params.chain}
            dex_name={params.dex}
            displayMetrics={"liquidity"}
          />
          <XYKOverviewTimeSeries
            chain_name={params.chain}
            dex_name={params.dex}
            displayMetrics={"volume"}
          />
        </div>
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Tokens
        </h2>
        <XYKTokenListView
          chain_name={params.chain}
          dex_name={params.dex}
          on_token_click={(e: any)=>{
            router.push(`/${params.chain}/${params.dex}/tokens/${e}`)
          }}
        />
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Pools
        </h2>
        <XYKPoolListView
          chain_name={params.chain}
          dex_name={params.dex}
          on_pool_click={(e: any)=>{
            router.push(`/${params.chain}/${params.dex}/pools/${e}`)
          }}
        />
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Transactions
        </h2>
        <XYKOverviewTransactionsListView
          chain_name={params.chain}
          dex_name={params.dex}
          on_native_explorer_click={(e: { explorers: { url: string | URL | undefined; }[]; })=>{
            window.open(e.explorers[0].url, '_blank');
          }}
          on_goldrush_receipt_click={(e: { tx_hash: any; })=>{
            window.open(`https://goldrush-tx-receipt-ui.vercel.app/tx/${params.chain}/${e.tx_hash}/`, '_blank');
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
