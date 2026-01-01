
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  LayoutGrid,
  Mail,
  Users,
  Settings,
  ChevronsUpDown,
  Atom,
  LogOut,
  UserCircle,
  CreditCard,
  ShoppingBasket,
  LayersPlus,
  ListOrdered,
  HandCoins,
  BellRing,
  CalendarPlus,
  TicketPercent,
  TicketPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
const menuItems = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        icon: LayoutGrid,
        href: "/app",
        isActive: true,
      },
    ]
  },
  {
    label: "Products",
    items: [
      {
        title: "Products",
        icon: ShoppingBasket,
        href: "/app/products",
      },
      {
        title: "Create Product",
        icon: LayersPlus,
        href: "/app/products/create",
      },
    ]
  }, {
    label: "Orders",
    items: [
      {
        title: "Orders",
        icon: ListOrdered,
        href: "/app/orders",
      },
    ]
  }, {
    label: "Payments",
    items: [
      {
        title: "Payments",
        icon: HandCoins,
        href: "/app/payments",
      },
    ]
  }, {
    label: "Events",
    items: [
      {
        title: "Events",
        icon: BellRing,
        href: "/app/events",
      },
      {
        title: "Create Event",
        icon: CalendarPlus,
        href: "/app/events/create",
      },
    ]
  }, {
    label: "Controllers",
    items: [
      {
        title: "Inbox",
        icon: Mail,
        href: "/app/controllers/inbox",
      },
      {
        title: "Notifications",
        icon: BellRing,
        href: "/app/controllers/calendar",
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/app/controllers/settings",
      },
    ]
  }, {
    label: "Discount",
    items: [
      {
        title: "Discount",
        icon: TicketPercent,
        href: "/app/discount",
      },
      {
        title: "Create Discount",
        icon: TicketPlus,
        href: "/app/discount/create",
      },
    ]
  }
];


const shops = [
  {
    id: 1,
    name: "Store 1",
    logo: "https://via.placeholder.com/150",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Store 2",
    logo: "https://via.placeholder.com/150",
    category: "Fashion",
  },
  {
    id: 3,
    name: "Store 3",
    logo: "https://via.placeholder.com/150",
    category: "Home",
  },
]


export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [currentShop, setCurrentShop] = React.useState(shops[0]);

  return (
    <Sidebar collapsible="offExamples" className="lg:border-r-0!" {...props}>
      <SidebarHeader className="p-3 sm:p-4 lg:p-5 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded bg-linear-to-b from-[#6e3ff3] to-[#aa8ef9] text-white">
            <Atom className="size-3" />
          </div>
          <span className="font-semibold text-base sm:text-lg">Cliento</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 sm:px-4 lg:px-5">
        <Select  defaultValue={shops[0].name} onValueChange={(val)=>{
          const shop = shops.find((shop) => shop.name === val);
          if (shop) {
            setCurrentShop(shop);
          }
        }}>
          <SelectTrigger size="default" className="w-full py-4">
            <SelectValue className="py-4">
                  <h3 className="text-sm">{currentShop.name}</h3>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full">
            {
              shops.map((shop) => (
                <SelectItem value={shop.name}>
                  <div className="flex justify-start items-center">
                    <Avatar className="mr-2" >
                      <AvatarImage src={shop.logo} />
                      <AvatarFallback>FC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h3 className="text-sm">{shop.name}</h3>
                      <p className="text-xs text-muted-foreground">{shop.category}</p>
                    </div>
                  </div>
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <>
                  <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
                  {item.items.map((item) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className="h-9 sm:h-[38px]">
                        <Link to={item.href}>
                          <item.icon className="size-4 sm:size-5" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors">
            <Avatar className="size-7 sm:size-8">
              <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=john" />
              <AvatarFallback className="text-xs">JC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs sm:text-sm">John Cornor</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                Johncornor@mail.com
              </p>
            </div>
            <ChevronsUpDown className="size-4 text-muted-foreground shrink-0" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem>
            <UserCircle className="size-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="size-4 mr-2" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="size-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Sidebar>
  );
}