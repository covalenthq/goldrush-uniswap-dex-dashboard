"use client"

import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChainItem, CovalentClient, SupportedDex } from "@covalenthq/client-sdk"
import { Flex } from "@radix-ui/themes"
import { Check, ChevronsUpDown } from "lucide-react"

import { DexContext } from "@/lib/store"
import { COVALENT_API_KEY, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

export default function IndexPage() {
  const { dex_name } = useContext(DexContext)
  const [allChains, setChains] = useState<ChainItem[]>([])
  const [allDexs, setDexs] = useState<SupportedDex[]>([])
  const [address, setAddress] = useState(dex_name ? dex_name : "")
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [openDex, setOpenDex] = useState(false)
  const [dexMap, setDexMap] = useState()
  const [chainMap, setChainMap] = useState()


  const [value, setValue] = useState("")
  const { toast } = useToast()

  const handleSupported = async (dexs: SupportedDex[], chains: ChainItem[]) => {
    const chain_map: any = {}

    for(const i of dexs){
      const dex = dexs.find((o: { dex_name: any }) => o.dex_name === i.dex_name)
      
      if(!chain_map[i.chain_name]){
        chain_map[i.chain_name] = [dex]
      }else{
        chain_map[i.chain_name] = [...chain_map[i.chain_name], dex]
      }
    }

    const dex_map: any = {}

    for(const i of dexs){
      const chain = chains.find((o: { name: any }) => o.name === i.chain_name)

      if(!dex_map[i.dex_name]){
        dex_map[i.dex_name] = [chain]
      }else{
        dex_map[i.dex_name] = [...dex_map[i.dex_name], chain]
      }
    }

    setChainMap(chain_map)
    setDexMap(dex_map)

  }

  const handleAllChains = async () => {
    setBusy(true)
    if (!COVALENT_API_KEY) return

    const client = new CovalentClient(COVALENT_API_KEY)
    try {
      const allChainsResp = await client.BaseService.getAllChains()
      if (allChainsResp.error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: allChainsResp.error_message,
        })
      }
      setChains(allChainsResp.data.items)
      return allChainsResp.data.items
    } catch (exception) {
      console.log(exception)
    }
    setBusy(false)
  }

  const handleAllDex = async () => {
    setBusy(true)
    if (!COVALENT_API_KEY) return

    const client = new CovalentClient(COVALENT_API_KEY)
    try {
      const allDexsResp = await client.XykService.getSupportedDEXes()
      if (allDexsResp.error) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: allDexsResp.error_message,
        })
      }
      return allDexsResp.data.items
    } catch (exception) {
      console.log(exception)
    }

    setBusy(false)
  }


  useEffect(() => {
    (async () => {
      const chains = await handleAllChains()
      const dexs = await handleAllDex()
      if(chains && dexs){
        handleSupported(dexs, chains)
      }
      setBusy(false)
    })();
  }, [])

  useEffect(() => {
    if(chainMap){
      setAddress("");
      setDexs(chainMap[value])
    }
  }, [value])

  return (
    <section className="container flex flex-col justify-center gap-6 md:py-10 h-[calc(100vh-150px)] items-center ">
      <Flex direction="column" gap="4">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          GoldRush Uniswap Dex Dashboard UI
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste
          into your apps. Free. Open Source. And Next.js 13 Ready.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            router.push(`${value}/${address}/overview/`)
          }}
        >
          <Flex direction="column" gap="3">

            <Popover open={open} onOpenChange={setOpen}>
              <Label htmlFor="dex_name">Chain name</Label>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[400px] justify-between"
                >
                  {value
                    ? allChains.find((chain) => chain.name === value)?.label
                    : "Select chain..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 max-h-96 overflow-y-scroll">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No chain found.</CommandEmpty>
                  <CommandGroup className="">
                    {allChains.map((chain) => (
                      <CommandItem
                        className="cursor-pointer hover:bg-accent-foreground dark:hover:bg-popover-foreground"
                        key={chain.label}
                        value={chain.name}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === chain.label ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {chain.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover open={openDex} onOpenChange={setOpenDex}>
              <Label htmlFor="dex_name">Dex name</Label>
              <PopoverTrigger asChild>
                <Button
                  disabled={!value}
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDex}
                  className="w-[400px] justify-between"
                >
                  {allDexs && address
                    ? allDexs.find((dex) => dex.dex_name === address)?.dex_name
                    : "Select dex..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 max-h-96 overflow-y-scroll">
                <Command>
                  <CommandInput placeholder="Search dex..." />
                  <CommandEmpty>No dex found.</CommandEmpty>
                  <CommandGroup className="">
                    {allDexs && allDexs.map((dex) => (
                      <CommandItem
                        className="cursor-pointer hover:bg-accent-foreground dark:hover:bg-popover-foreground"
                        key={`${dex.dex_name}-${dex.chain_name}`}
                        value={dex.dex_name}
                        onSelect={(currentValue) => {
                          setAddress(currentValue === value ? "" : currentValue)
                          setOpenDex(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === dex.dex_name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {dex.dex_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <div>
              <Button
                disabled={address.length === 0 || !value || busy}
                type="submit"
              >
                Continue
              </Button>
            </div>
          </Flex>
        </form>
      </Flex>
    </section>
  )
}
