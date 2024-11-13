"use client"

import React, { forwardRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import PlanCard from "@/components/plan-card";
import Link from "next/link"
import Header from '@/components/header'


export default function HomePage() {
  const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";
  const [isMounted, setIsMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('')

  const [planName, setPlanName] = useState();
  const [planDesc, setPlanDesc] = useState();
  const [date, setDate] = useState();

  const [planList, setPlanList] = useState([]);

  const getPlansList = async (email) => {
    const response = await fetch('/api/get_plans?email=' + email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    const planList = data.plans

    setPlanList(planList)
  }

  useEffect(() => {
    // Esto se ejecuta solo en el cliente
    
  }, []);

  

  return (
    <div className="min-h-screen flex flex-col">
      <Header userId={userId}></Header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-8">
        
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-2">
        <p className="text-sm text-gray-600">© 2024 IgnacioCode</p>
      </footer>
    </div>
  );
}

const ListItem = forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
