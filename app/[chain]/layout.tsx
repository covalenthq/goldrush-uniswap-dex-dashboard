"use client"
import { useContext, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const pathRegex = pathname.match(/\/([^\/]*)$/)
  const path = pathRegex ? pathRegex[1] : pathname

  const handleTabSwitch = (route: string) => {
    const routeSegments = pathname.split('/');
    routeSegments[3] = route;
    if(routeSegments.length > 4){
      routeSegments.pop();
    }
    const newRoute = routeSegments.join('/');
    router.push(newRoute);
    
  }

  return (
    <Flex
      direction="column"
      gap="4"
      className="container min-h-[calc(100vh-150px)] py-8"
    >
      <Tabs value={path} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="overview"
            onClick={() => {
              handleTabSwitch("overview")
            }}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tokens"
            onClick={() => {
              handleTabSwitch("tokens")
            }}
          >
            Tokens
          </TabsTrigger>
          <TabsTrigger
            value="pools"
            onClick={() => {
              handleTabSwitch("pools")
            }}
          >
            Pools
          </TabsTrigger>
          <TabsTrigger
            value="account"
            onClick={() => {
              handleTabSwitch("account")
            }}
          >
            Account
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {children}
    </Flex>
  )
}
