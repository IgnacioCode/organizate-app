"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link"

function PlanCard({ planIndex, planName, planDescription, avatarSrc }) {
    const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";
    return (
        <div className="border rounded-lg p-4 shadow-md flex flex-col">
            <div className="pr-2 mb-2 flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold">{planName || `Plan ${planIndex + 1}`}</h2>
                <Avatar>
                    <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_${avatarSrc}.png`} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-left">
                {planDescription || `Descripción del plan ${planIndex + 1} al que el usuario está afiliado o ha creado.`}
            </p>
            <Link className="w-full" href={"/plan/details?planId=" + planIndex}>
                <Button className="mt-4 w-full">
                    Ver detalles
                </Button>
            </Link>

        </div>
    );
}

export default PlanCard;
