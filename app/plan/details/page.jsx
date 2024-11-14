"use client"

import React, { forwardRef, useState, useEffect } from "react";
import Header from '@/components/header'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

function formatDate(dateString) {
  const date = new Date(dateString);

  // Obtener día, mes y año
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
  const year = date.getFullYear();

  // Obtener horas y minutos
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Formatear la fecha en DD/MM/AAAA HH:MM
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export default function HomePage() {
  const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";

  const [userId, setUserId] = useState('')
  const [planName, setPlanName] = useState();
  const [planDesc, setPlanDesc] = useState();
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({})

  const searchParams = useSearchParams()

  const planIdURL = searchParams.get('planId')

  useEffect(() => {
    const user_id = localStorage.getItem('userId')
    setUserId(user_id);
    //setPlanList(JSON.parse(localStorage.getItem('planList')))
    let storedList = JSON.parse(localStorage.getItem('planList'))
    console.log(storedList);
    setPlanList(storedList)

    storedList.forEach((plan) => {
      if (plan.plan_id == planIdURL) {
        setSelectedPlan(plan)
      }
    })

  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header userId={userId}></Header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center p-8">
        <div className="border rounded-lg p-6 shadow-md flex flex-col items-start lg:min-w-[800px]">
          <div className="pr-2 mb-2 flex flex-row justify-between items-center">
            {selectedPlan.name ? (<h1 className="text-3xl font-bold">{selectedPlan.name}</h1>) : (<Skeleton className="h-4 w-[350px]" />)}
          </div>
          {selectedPlan.description ? (<p className="text-sm text-muted-foreground mt-2 text-left">{selectedPlan.description}</p>) : (<Skeleton className="h-4 w-[400px]" />)}
          <div className="mt-2 flex flex-row items-center">
            <p className="text-lg font-bold">Date:</p>
            {selectedPlan.date ? (<p className="ml-2 text-lg " >{formatDate(selectedPlan.date)}</p>) : (<Skeleton className="h-4 w-[250px] ml-2" />)}
          </div>
          <div className="flex flex-row items-start">
            <div className="mt-2 flex flex-col items-start">
              <p className="text-lg font-bold">People invited</p>
              <ScrollArea className="mt-2 h-72 w-48 rounded-md border">
                <div className="flex flex-col p-4 items-start">
                  {tags.map((tag, key) => (
                    <>
                      <div key={tag} className="text-sm">
                        {tag}
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="mt-2 ml-12 flex flex-col justify-items-start hidden lg:block">
              <p className="text-lg font-bold">Comments</p>
              <ScrollArea className="mt-2 h-72 rounded-md border resize-y min-h-72">
                <Table className="w-max">
                  <TableHeader>
                    <TableRow className="p-2">
                      <TableHead className="lg:w-[500px]">Comment</TableHead>
                      <TableHead className="lg:w-[135px]">Date</TableHead>
                      <TableHead className="lg:w-[100px]">Author</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="text-left">
                      <TableCell className="max-w-[500px]">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</TableCell>
                      <TableCell>12/11/24 11:19</TableCell>
                      <TableCell className="">
                        <div className="flex flex-row items-center">
                          <Avatar>
                            <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_admin.png`} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="ml-2">Pablo</p>
                        </div>

                      </TableCell>
                    </TableRow>
                    <TableRow className="text-left">
                      <TableCell className="max-w-[500px]">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</TableCell>
                      <TableCell>12/11/24 11:19</TableCell>
                      <TableCell className="">
                        <div className="flex flex-row items-center">
                          <Avatar>
                            <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_admin.png`} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="ml-2">Pablo</p>
                        </div>

                      </TableCell>
                    </TableRow>
                    <TableRow className="text-left">
                      <TableCell className="max-w-[500px]">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</TableCell>
                      <TableCell>12/11/24 11:19</TableCell>
                      <TableCell className="">
                        <div className="flex flex-row items-center">
                          <Avatar>
                            <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_admin.png`} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="ml-2">Pablo</p>
                        </div>

                      </TableCell>
                    </TableRow>


                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-col w-full gap-1.5 mt-2 items-start">
            <h1 className="text-lg font-bold">Your comment</h1>
            <div className="flex flex-row w-[70%]">
              <Textarea placeholder="Type your message here." id="message" className="resize-none h-[80px] " />
              <Button>Send</Button>
              <Button variant="destructive">Quit plan</Button>
            </div>

          </div>


        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-2">
        <p className="text-sm text-gray-600">© 2024 IgnacioCode</p>
      </footer>
    </div>
  );
}



