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
    console.log(planList);
    
    localStorage.setItem('planList', JSON.stringify(planList));
        
    return planList;
  }

  useEffect(() => {
    // Esto se ejecuta solo en el cliente
    const email = localStorage.getItem('userEmail');
    const user_id = localStorage.getItem('userId');
    
    setUserId(user_id);
    setUserEmail(email);
    getPlansList(email)    
  }, []);

  const handleSumbit = async () => {

    try {
      const response = await fetch('/api/create_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: planName, description: planDesc, date: date }),
      });
      getPlansList(localStorage.getItem('userEmail'))
    }
    catch (e) {
      console.log(e);

    }

  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header userId={userId}></Header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Plan Panels */}
          {planList ? (planList.map((plan, index) => (
            <PlanCard
              key={index}
              planIndex={plan.plan_id}
              planName={plan.name}
              planDescription={plan.description}
              avatarSrc={plan.user_id}
            />
          ))) : <div></div>}
          {/* Create Plan Button */}
          <Sheet>
            <SheetTrigger asChild>
              <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100">
                <Button variant="ghost">Crear un nuevo plan</Button>
              </div>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Create new plan</SheetTitle>
                <SheetDescription>
                  Write all the information for your new plan! Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" className="col-span-3" onChange={(e) => setPlanName(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Description
                  </Label>
                  <Textarea className="col-span-3" onChange={(e) => setPlanDesc(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Date
                  </Label>
                  <Popover className="col-span-3">
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleSumbit}>Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-2">
        <p className="text-sm text-gray-600">© 2024 IgnacioCode</p>
      </footer>
    </div>
  );
}

