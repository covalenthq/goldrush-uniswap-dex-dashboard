'use client'
import { useRouter } from "next/navigation";
import { XYKWalletTransactionsListView, XYKWalletPoolListView, XYKWalletInformation, XYKWalletPositionsListView  } from "@covalenthq/goldrush-kit";
import { Flex } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Account({ params }: { params: { chain: string, dex: string } }) {
  const router = useRouter();
  const [walletAddress, setAddress] = useState("")
  const [input, setInput] = useState("");

  return (
    <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Account
        </h1>
        <Flex align="end" gap="4">
          <div>
            <Label htmlFor="wallet_address">Wallet address</Label>
            <Input
              className="w-[400px]"
              type="input"
              id="address"
              placeholder="Wallet address"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          </div>
          <Button onClick={()=>{
            setAddress(input)
          }}>Load account details</Button>
        </Flex>
        <XYKWalletInformation
          chain_name={params.chain}
          dex_name={params.dex}
          wallet_address={walletAddress}
        />
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Positions
        </h2>
        <XYKWalletPositionsListView
          chain_name={params.chain}
          dex_name={params.dex}
          wallet_address={walletAddress}
          on_pool_click={(e: any)=>{
            router.push(`/${params.chain}/${params.dex}/pools/${e}`)
          }}
        />
        <h2 className="text-xl font-extrabold leading-tight tracking-tighter md:text-2xl">
          Transactions
        </h2>
        <XYKWalletTransactionsListView
          chain_name={params.chain}
          dex_name={params.dex}
          wallet_address={walletAddress}
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
