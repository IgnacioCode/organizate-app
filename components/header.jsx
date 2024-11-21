"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function Header({ userId }) {
    const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";

    return (
        <header className="p-3 flex shadow-lg">
            <div className="flex-1">
                <Button variant="ghost" className="mr-3 h-[40px]"><Link href="/">Home</Link></Button>
                <Button variant="ghost" className="mr-3 h-[40px]"><Link href="/groups">Groups</Link></Button>
                <Button variant="ghost" className="mr-3 h-[40px]"><Link href="/profile/edit">My profile</Link></Button>
            </div>
            <div className="flex content-end mr-3 content-center">
                <Button variant="ghost" className="mr-3 h-[40px]">Log out</Button>
                <Avatar>
                    {userId ? (
                        <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_${userId}.png?${localStorage.getItem('pfp_version')}`} />
                    ) : (
                        <AvatarFallback>{userId.substring(0, 2)}</AvatarFallback>
                    )}
                </Avatar>
            </div>
        </header>
    )

}