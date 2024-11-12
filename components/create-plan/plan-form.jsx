"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const formSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
});

export default function CreatePlanForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      description: "",
    },
  });

  const handleSubmit = async (values) => {
    console.log(values);
    // Aquí puedes enviar los datos del nuevo plan al servidor o manejarlos según sea necesario
    try {
      const response = await fetch('/api/create_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log(response);
      if (response.ok) {
        alert('Plan created successfully');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Crear un nuevo plan</h2>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="planName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full bg-primary" type="submit">
              Create Plan
            </Button>
          </form>
        </Form>
      </div>
  );
}
