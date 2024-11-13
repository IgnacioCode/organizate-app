"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function RegistrationForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values) => {
    console.log(values);
    
    try{
      const response = await fetch('/api/create_usr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log(response);
      if(response.ok){
        const newBody = { email:values.email, password:values.password }
        console.log(newBody);
        
        const responseLogin = await fetch('/api/usr_login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newBody),
        });
        const data = await responseLogin.json();
        const user_id = data.user_id;
        if(responseLogin.ok){
          localStorage.setItem('userEmail', values.email);
          localStorage.setItem('userId', user_id);
          router.push('/');
        }
        else{
          router.push('/login');
        }
      }
    }
    catch(e){
      console.log(e);
      
    }
    
  };

  useEffect(() => {
    let i = 0;
    const text = "Plan your life";
    const typingSpeed = 150;
    const cursorSpeed = 300;
    const targetElement = document.getElementById("animated-text");

    if (targetElement) {
      const typeWriter = setInterval(() => {
        if (i < text.length) {
          targetElement.innerHTML = text.slice(0, i + 1) + "<span class='cursor'>_</span>";
          i++;
        } else {
          clearInterval(typeWriter);
        }
      }, typingSpeed);
      const cursorBlink = setInterval(() => {
        const cursor = document.querySelector(".cursor");
        if (cursor) {
          cursor.style.opacity = cursor.style.opacity === "1" ? "0" : "1";
        }
      }, cursorSpeed);

      // Clear intervals when component unmounts
      return () => {
        clearInterval(typeWriter);
        clearInterval(cursorBlink);
      };
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="w-1/2 bg-primary flex items-center justify-center">
        <h1 id="animated-text" className="text-7xl font-bold text-white"></h1>
      </div>
      {/* Right side */}
      <div className="flex w-1/2 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your details to create a new account and start planning!
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full bg-primary">
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
