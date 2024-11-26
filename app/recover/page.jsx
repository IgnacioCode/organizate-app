"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useSearchParams } from 'next/navigation'

export default function Page() {

    const router = useRouter();
    const { toast } = useToast()
    const [password, setPassword] = useState('');

    const searchParams = useSearchParams()

    const recoverToken = searchParams.get('token')

    const handlePasswordRecovery = async () => {
        try {
            const response = await fetch('/api/user/recover_psw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword: password, token: recoverToken }),
            });
            const data = await response.json();
            console.log(data);

            if (data.success) {
                toast({
                    variant: "success",
                    title: "Password changed!",
                    description: "The new password has been set successfully. You can try to login."
                })
                router.push("/login")
            } else {
                toast({
                    variant: "destructive",
                    title: "Email not sent!",
                    description: "An error occurred while sending the email."
                })
            }
        }
        catch (e) {
            console.log(e);

        }
    }

    return (
        (<div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Password recovery</CardTitle>
                    <CardDescription>
                        Enter a new password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">New password</Label>
                            </div>
                            <Input id="password" type="password" required onChange={(e) => { setPassword(e.target.value) }} />
                        </div>
                        <Button type="submit" className="w-full" onClick={handlePasswordRecovery}>
                            Change password
                        </Button>
                    </div>
                </CardContent>
            </Card></div>)
    );
}
