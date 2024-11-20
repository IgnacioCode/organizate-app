"use client"

import React, { useState, useEffect } from "react";
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
import { comment } from "postcss";
import { formatDate } from "@/app/utils/general"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function HomePage() {
  const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";

  const [userId, setUserId] = useState('')
  const [textValue, setTextValue] = useState('');
  const [planList, setPlanList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({})
  const [commentList, setCommentList] = useState([]);
  const [invitedList, setInvitedList] = useState([]);

  const searchParams = useSearchParams()

  const planIdURL = searchParams.get('planId')

  const getPlanComments = async () => {

    const response = await fetch('/api/comment/get_comments?plan_id=' + planIdURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json()

    setCommentList(data.comments)

  }

  const getPlanInvited = async () => {

    const response = await fetch('/api/plan/get_plan_people?plan_id=' + planIdURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json()

    setInvitedList(data.guests)

  }


  const sendNewComment = async () => {

    let values = {
      plan_id: planIdURL,
      user_id: userId,
      content: textValue
    }

    const response = await fetch('/api/comment/add_comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    console.log(response);
    if (response.ok) {
      setTextValue('')
      getPlanComments()
    }

  }


  useEffect(() => {

    const storedUserId = localStorage.getItem('userId')
    let storedList = JSON.parse(localStorage.getItem('planList'))

    setPlanList(storedList)
    setUserId(storedUserId)
    storedList.forEach((plan) => {
      if (plan.plan_id == planIdURL) {
        setSelectedPlan(plan)
      }
    })

    getPlanComments()
    getPlanInvited()

  }, []);

  useEffect(() => {
    console.log(commentList, invitedList);
  }, [commentList, invitedList]);

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
            {selectedPlan.date ? (<p className="ml-2 text-lg " >{formatDate(selectedPlan.date,"DD/MM/YYYY HH:mm")}</p>) : (<Skeleton className="h-4 w-[250px] ml-2" />)}
          </div>
          {
            selectedPlan.invite_key ? (<div className="mt-2 flex flex-row items-center">
              <p className="text-lg font-bold">Invitation key:</p>
              <p className="ml-2 text-lg " >{selectedPlan.invite_key}</p>
            </div>) : (<div></div>)
          }
          <div className="flex flex-row items-start">
            <div className="mt-2 flex flex-col items-start">
              {
                invitedList.length ? (<div className="flex flex-row">
                  <p className="text-lg font-bold">People invited</p>
                  <p className="ml-2 text-lg " >{invitedList.length}</p>
                </div>) : (<><Skeleton className="h-4 w-full" /></>)
              }
              <ScrollArea className="mt-2 h-72 w-48 rounded-md border">
                <div className="flex flex-col p-2 items-start">
                  {invitedList.length ? (invitedList.map((invitee) => (
                    <><div key={invitee.user_id} className="flex flex-row items-center ml-2 mb-2 mt-2">
                      <Avatar>
                        <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_` + invitee.user_id + '.png'} />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <p className="ml-2">{invitee.username}</p>
                    </div>
                      <Separator></Separator>
                    </>
                  ))) : (<Skeleton className="h-4 w-full" />)}
                </div>
              </ScrollArea>

            </div>
            <div className="mt-2 ml-12 flex flex-col justify-items-start hidden lg:block">
              <p className="text-lg font-bold">Comments</p>
              <ScrollArea className="mt-2 h-72 rounded-md border resize-y min-h-72">
                <Table className="w-max">
                  <TableHeader>
                    <TableRow className="p-2">
                      <TableHead className="lg:w-[480px]">Comment</TableHead>
                      <TableHead className="lg:w-[175px]">Date</TableHead>
                      <TableHead className="lg:w-[100px]">Author</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commentList != [] ? (commentList.map((comment) => (
                      <TableRow className="text-left">
                        <TableCell className="max-w-[500px]">{comment.content}</TableCell>
                        <TableCell>{comment.created_at}</TableCell>
                        <TableCell className="">
                          <div className="flex flex-row items-center">
                            <Avatar>
                              <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_` + comment.user_id + '.png'} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="ml-2">{comment.username}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))) : (<div></div>)
                    }

                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <div className="flex flex-col w-full gap-1.5 mt-2 items-start">
            <h1 className="text-lg font-bold">Your comment</h1>
            <div className="flex flex-row w-[70%] items-end">
              <Textarea value={textValue} onChange={(e) => setTextValue(e.target.value)} placeholder="Type your message here." id="newComment" className="resize-none h-[80px] " />
              <Button className="ml-2 w-[100px] h-[50px]" onClick={sendNewComment}>Send</Button>
              <Button className="ml-2 w-[100px] h-[50px]" variant="destructive">Quit plan</Button>
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



