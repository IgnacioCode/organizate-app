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


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recEmail, setRecEmail] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/usr_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const user_id = data.user_id;
      const username = data.username;
      console.log(data);

      if (data.success) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', user_id);
        localStorage.setItem('username', username);
        localStorage.setItem('pfp_version', new Date().getTime());
        router.push("/")
      } else {
        toast({
          variant: "destructive",
          title: "Wrong credentials!",
          description: "The input credentials don't match any user."
        })
      }
    }
    catch (e) {
      console.log(e);

    }
  }

  const handlePasswordRecovery = async () => {
    try {
      const response = await fetch('/api/user/send_psw_rec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail: recEmail, emailSubject: "Organizate Password recovery"}),
      });
      const data = await response.json();
      console.log(data);

      if (data.success) {
        toast({
          variant: "success",
          title: "Recovery email sent!",
          description: "An email has been sent to the provided email address with instructions to reset your password."
        })
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
    (<Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Link href="" className="ml-auto inline-block text-sm underline" >
                    Forgot your password?
                  </Link>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Send recovery link</AlertDialogTitle>
                    <AlertDialogDescription>
                      Enter the email you used to register and we will send you a password reset link.
                    </AlertDialogDescription>
                    <Input id="recEmail" type="email" placeholder="m@example.com" required onChange={(e) => { setRecEmail(e.target.value) }} />
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePasswordRecovery}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
            <Input id="password" type="password" required onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          <Button type="submit" className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>)
  );
}
