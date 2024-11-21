"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link"

function PlanCard({ planIndex, planName, planDescription, avatarSrc, planDate }) {
    const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";
    return (
        <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
            <div className="pr-2 mb-2 flex flex-row justify-between items-center">
                <div className="flex flex-row items-center">
                    <h2 className="text-xl font-bold">{planName || `Plan ${planIndex + 1}`}</h2>
                    <p className="text-sm text-muted-foreground ml-2">{planDate || `Fecha no disponible`}</p>
                </div>

                <Avatar>
                    <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_${avatarSrc}.png?${localStorage.getItem('pfp_version')}`} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-left">
                {planDescription || `Descripción del plan ${planIndex + 1} al que el usuario está afiliado o ha creado.`}
            </p>
            <Link className="w-full" href={"/plan/details?planId=" + planIndex}>
                <Button className="mt-4 w-full">
                    See details
                </Button>
            </Link>
        </div>
    );
}

export default PlanCard;
