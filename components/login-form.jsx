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


export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try{
      const response = await fetch('/api/usr_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      const user_id = data.user_id;
      console.log(data);
      
      if (data.success) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', user_id);
        router.push("/")
      } else {
        toast({
          title: "Wrong credentials!",
          description: "The input credentials don't match any user.",
        })
      }
    }
    catch(e){
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
            <Input id="email" type="email" placeholder="m@example.com" required onChange={(e)=>{setEmail(e.target.value)}} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline" >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required onChange={(e)=>{setPassword(e.target.value)}} />
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
