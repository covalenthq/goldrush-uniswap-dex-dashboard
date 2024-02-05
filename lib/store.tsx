import { createContext, useState, type ReactNode } from "react"
import { GoldRushProvider } from "@covalenthq/goldrush-kit"
import { useTheme } from "next-themes"

import { KeyDialog } from "@/components/key-dialog"

import { COVALENT_API_KEY } from "./utils"

interface DexContextType {
  dex_name: string
  setDex: Function
  chains: any
  setChains: Function
  tableState: { [key: string]: boolean }
  setTableState: Function
  color: string
  setColor: Function
  setBorderRadius: Function
  borderRadius: string
}

export const DexContext = createContext<DexContextType>({} as DexContextType)

interface DexProviderProps {
  children: ReactNode
}

export const DexProvider: React.FC<DexProviderProps> = ({ children }) => {
  const { theme } = useTheme()
  const [dex, setDex] = useState<string>("")
  const [chains, setChains] = useState<[]>([])
  const [tableState, setTableState] = useState({})
  const [color, setColor] = useState<any>("slate")
  const [borderRadius, setBorderRadius] = useState<any>("medium")

  const mode: any = theme

  return (
    <GoldRushProvider
      apikey={COVALENT_API_KEY ? COVALENT_API_KEY : ""}
      mode={mode}
      color={color}
      border_radius={borderRadius}
    >
      <DexContext.Provider
        value={{
          dex_name: dex,
          setDex,
          chains,
          setChains,
          tableState,
          setTableState,
          setColor,
          color,
          setBorderRadius,
          borderRadius,
        }}
      >
        {children}
      </DexContext.Provider>
    </GoldRushProvider>
  )
}
