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

export default function EditProfilePage() {
    const router = useRouter();
    const STATIC_FILES_DOMAIN = "https://pub-74f750fca2674001b0494b726a588ec5.r2.dev";

    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const email = localStorage.getItem('userEmail');

        setUserId(storedUserId);
        setUsername(storedUsername || '');
        setEmail(email || '');
    }, []);

    const handleNameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
        }
    };

    const handleSaveChanges = async () => {
        // Crear un FormData para enviar la imagen y otros datos
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('username', username);
        formData.append('password', password);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('/api/user/update_profile', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Actualiza el nombre de usuario en el localStorage
                localStorage.setItem('username', username);
                router.push('/'); // Redirigir a la página principal o un perfil
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header userId={userId} />

            <main className="flex flex-1 flex-col items-center justify-center text-center p-8">
                <div className="border rounded-lg p-6 shadow-md flex flex-col items-start lg:min-w-[400px]">
                    <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

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

                        <div className="flex flex-row items-center">
                            <p className="text-lg font-bold mr-4">Profile picture:</p>
                            <Avatar className="size-24">
                                {userId ? (
                                    <AvatarImage src={`${STATIC_FILES_DOMAIN}/pfp_${userId}.png`} />
                                ) : (
                                    <AvatarFallback>CNA</AvatarFallback>
                                )}
                            </Avatar>
                        </div>


                    </div>

                    <Separator className="my-4" />

                    {/* Foto de perfil */}
                    <div className="mt-2 flex flex-row items-center">
                        <p className="text-lg font-bold w-64">Update profile picture:</p>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input id="picture" type="file" className="pt-[6px]" />
                        </div>

                    </div>




                    {/* Formulario para cambiar el nombre */}
                    <div className="flex flex-col w-full mb-4">
                        <Label htmlFor="username" className="mb-2">Change Name</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={handleNameChange}
                            placeholder="Enter your new name"
                        />
                    </div>

                    {/* Formulario para cambiar la contraseña */}
                    <div className="flex flex-col w-full mb-4">
                        <Label htmlFor="password" className="mb-2">Change Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                        />
                    </div>

                    {/* Botón para guardar cambios */}
                    <Button className="w-full mt-4" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </div>
            </main>

            <footer className="bg-gray-200 text-center p-2">
                <p className="text-sm text-gray-600">© 2024 IgnacioCode</p>
            </footer>
        </div>
    );
}