"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PresentationData } from '@/lib/types';
import { PresentationView } from '@/components/presentation-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Presentation, Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const examSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required.'),
  componentCode: z.string().min(1, 'Component Code is required.'),
  componentTitle: z.string().min(1, 'Component Title is required.'),
  centreNumber: z.string().min(1, 'Centre Number is required.'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format.'),
  extraTime: z.coerce.number().int().min(0, 'Must be a positive number.').optional().default(0),
});

const formSchema = z.object({
  exams: z.array(examSchema).min(1).max(2),
});


export default function Home() {
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [isDualExam, setIsDualExam] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exams: [
        {
          qualification: 'GCSE',
          componentCode: 'GMC11',
          componentTitle: 'English Unit 4',
          centreNumber: '12345',
          startTime: '09:00',
          endTime: '10:30',
          extraTime: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = require("react-hook-form").useFieldArray({
    control: form.control,
    name: "exams",
  });
  
  const handleDualExamToggle = (checked: boolean) => {
    setIsDualExam(checked);
    if (checked) {
      append({
          qualification: 'GCSE',
          componentCode: 'MTH22',
          componentTitle: 'Mathematics Unit 2',
          centreNumber: '12345',
          startTime: '11:00',
          endTime: '12:30',
          extraTime: 0,
      });
    } else {
      // remove the second exam
      if (fields.length > 1) {
        remove(1);
      }
    }
  }


  async function handleStart(values: z.infer<typeof formSchema>) {
    try {
      await document.documentElement.requestFullscreen();
      setPresentationData(values.exams);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Fullscreen Error",
        description: "Could not enter fullscreen mode. Please ensure your browser allows it.",
      });
      console.error(err);
    }
  }

  async function handleExit() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Could not exit fullscreen", err);
    } finally {
      setPresentationData(null);
    }
  }
  
  if (presentationData) {
    return <PresentationView data={presentationData} onExit={handleExit} />;
  }

  return (
    <>
      <main className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl shadow-2xl">
           <Form {...form}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary rounded-md">
                        <Presentation className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Presentation Pro</CardTitle>
                        <CardDescription>Setup your presentation details below.</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FormLabel htmlFor="dual-exam-mode">Dual Exam</FormLabel>
                        <Switch
                            id="dual-exam-mode"
                            checked={isDualExam}
                            onCheckedChange={handleDualExamToggle}
                        />
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={form.handleSubmit(handleStart)}>
              <CardContent className="space-y-8">
                {fields.map((field, index) => (
                  <div key={field.id}>
                    {fields.length > 1 && (
                      <div className="mb-4">
                        <h3 className="text-2xl font-semibold tracking-tight">Exam {index + 1}</h3>
                        <Separator className="mt-2" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                          control={form.control}
                          name={`exams.${index}.qualification`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Qualification</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., A-Level" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name={`exams.${index}.centreNumber`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Centre Number</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., 12345" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className="md:col-span-2">
                        <FormField
                            control={form.control}
                            name={`exams.${index}.componentTitle`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Component Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Advanced Organic Chemistry" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                      <FormField
                          control={form.control}
                          name={`exams.${index}.componentCode`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Component Code</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., CHM12" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name={`exams.${index}.extraTime`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Extra Time (minutes)</FormLabel>
                              <FormControl>
                                  <Input type="number" min="0" step="1" placeholder="e.g., 15" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name={`exams.${index}.startTime`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                  <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name={`exams.${index}.endTime`}
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                  <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" size="lg">
                  Start Presentation
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
      <Toaster />
    </>
  );
}
