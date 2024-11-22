"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"
import { set } from "date-fns";
import { useToast } from "@/hooks/use-toast"

export default function EditProfilePage() {
    const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const router = useRouter();
    const { toast } = useToast()

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const email = localStorage.getItem('userEmail');

        setUserId(storedUserId);
        setUsername(storedUsername || '');
        setEmail(email || '');
    }, []);

    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleUsernameUpdate = async () => {
        const response = await fetch('/api/user/update_username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newUsername: newUsername,
                user_id: userId,
            }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('username', newUsername);
            setUsername(newUsername);
            router.push('/profile/edit');
        } else {

        }
    }

    const handleAvatarUpdate = async () => {
        if (!avatar) return

        const formData = new FormData()
        console.log(avatar);

        formData.append('file', avatar)
        formData.append('user_id', userId)

        const response = await fetch('/api/user/update_pfp', {
            method: 'POST',
            body: formData
        })
        console.log(response);
        
        if (!response.ok) {
            toast({
                variant: "destructive",
                title: "Error updating profile picture!",
                description: "There was an error updating your profile picture, try again later."
            })
        }

        const R2FormData = new FormData();

        const fileExtension = avatar.name.split('.').pop();
        const newFile = new File([avatar], `pfp_${userId}.${fileExtension}`, { type: avatar.type });
        R2FormData.append('file', newFile);

        const { url } = await response.json()
        console.log(avatar.type);

        let r2response = await fetch(url, {
            method: 'PUT',
            'Content-Type': avatar.type,
            body: newFile,
        })
        if (r2response.ok) {
            localStorage.setItem('pfp_version', new Date().getTime());
            router.refresh();
        }
        else {
            toast({
                variant: "destructive",
                title: "Error updating profile picture!",
                description: "There was an error updating your profile picture, try again later."
            })
        }

    }

    const handlePasswordUpdate = async () => {
        const response = await fetch('/api/user/update_psw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldPassword: password,
                newPassword: newPassword,
                user_id: userId,
            }),
        });

        const data = await response.json();

        if (data.success) {
            toast({
                variant: "success",
                title: "Password updated successfully!",
                description: "Your password has been updated successfully."
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error updating password!",
                description: "There was an error updating your password, try again later."
            })
        }
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Header userId={userId} />

            <main className="flex flex-1 flex-col items-center justify-center text-center p-8">
                <div className="border rounded-lg p-6 shadow-md flex flex-col items-start lg:min-w-[400px]">
                    <h1 className="text-3xl font-bold">Edit Profile</h1>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col justify-center">
                            <div className="mt-2 flex flex-row items-center">
                                <p className="text-lg font-bold">Username:</p>
                                {username ? (<p className="ml-2 text-lg " >{username}</p>) : (<Skeleton className="h-4 w-[250px] ml-2" />)}
                            </div>
                            <div className="mt-2 flex flex-row items-center">
                                <p className="text-lg font-bold">Email:</p>
                                {email ? (<p className="ml-2 text-lg " >{email}</p>) : (<Skeleton className="h-4 w-[250px] ml-2" />)}
                            </div>
                        </div>

                        <div className="flex flex-row items-center ml-4">
                            <p className="text-lg font-bold mr-4">Profile picture:</p>
                            <Avatar className="size-24">
                                {userId ? (
                                    <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_${userId}.png?${localStorage.getItem('pfp_version')}`} />
                                ) : (
                                    <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                                )}
                            </Avatar>
                        </div>


                    </div>

                    <Separator className="my-4" />

                    {/* Foto de perfil */}
                    <div className="mb-4 flex flex-row items-center">
                        <p className="text-lg text-left font-bold w-fit">Update profile picture:</p>
                        <div className="ml-4 grid items-center gap-1.5">
                            <Input id="picture" type="file" className="pt-[6px]" onChange={handleAvatarChange} />
                        </div>
                    </div>
                    <Button className="w-[50%]" onClick={handleAvatarUpdate}>
                        Update profile picture
                    </Button>

                    <Separator className="mt-4 mb-2" />

                    {/* Formulario para cambiar el nombre */}
                    <div className="flex flex-col w-full items-start">
                        <p className="text-lg font-bold mb-3">Change username</p>
                        <Label className="mb-2 ">New username</Label>
                        <Input
                            id="newUsername"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter your new name"
                        />
                        <Button className="mt-4 w-[50%]" onClick={handleUsernameUpdate}>
                            Update username
                        </Button>
                    </div>
                    <Separator className="mt-4 mb-2" />

                    {/* Formulario para cambiar la contraseña */}
                    <div className="flex flex-col w-full items-start">
                        <p className="text-lg font-bold mb-3">Change password</p>
                        <Label className="mb-2 ">Current password</Label>
                        <Input
                            id="username"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your new name"
                        />
                        <Label className="mb-2 mt-4 ">New password</Label>
                        <Input
                            id="username"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter your new name"
                        />
                        <Button className="mt-4 w-[50%]" onClick={handlePasswordUpdate}>
                            Update password
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-200 text-center p-2">
                <p className="text-sm text-gray-600">© 2024 IgnacioCode</p>
            </footer>
        </div>
    );
}
