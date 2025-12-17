'use client';

import { Coffee, EllipsisVertical, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SIDEBAR_MENU_LIST, SidebarMenuKey } from '@/constants/sidebar-constants';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { startTransition, useTransition } from 'react';
import { signOut } from '@/actions/auth-action';
import { toast } from 'sonner';

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname();
  const profile = {
    name: 'Avip Syaifulloh',
    role: 'admin',
    avatar_url: '',
  }

  const handleLogout = () => {
    startTransition(async () => {
      const result = await signOut()
      if (result.status === 'error') {
        toast.error(result.message)
        return
      }
      // useAuthStore.getState().clear()
      toast.success(result.message)
      router.push('/login')
    })
  }
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="font-semibold">
                <div className="bg-cyan-600 flex p-2 items-center justify-center rounded-md">
                  <Coffee className="size-4" />
                </div>
                WPU Cafe
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className='flex flex-col gap-2'>
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[profile.role.toLowerCase() as SidebarMenuKey].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className={cn('px-4 py-3 h-auto', {
                      'bg-cyan-600 text-white hover:bg-cyan-600! dark:hover:text-white':
                        pathname === item.url
                    })}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className='data-[state=open]:bg-cyan-600 data-[state=open]:text-accent dark:data-[state=open]:text-accent-foreground'>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback className="rounded-lg text-black dark:text-white">A</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <h4 className="truncate font-medium">Avip Syaifulloh</h4>
                    <p className="text-muted-foreground dark:data-[state=open]:text-white truncate text-xs capitalize">
                      Admin
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt="" />
                      <AvatarFallback className="rounded-lg">A</AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <h4 className="truncate font-medium">Avip Syaifulloh</h4>
                      <p className="text-muted-foreground truncate text-xs">
                        Admin
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    disabled={isPending}
                    onClick={() => handleLogout()}
                    className="cursor-pointer hover:bg-cyan-600! hover:text-white! transition-colors ease-in-out duration-300"
                  >
                    <LogOut className="size-4 hover:text-white" />
                    {isPending ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}