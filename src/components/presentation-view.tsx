"use client";

import type { PresentationData } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Clock } from '@/components/clock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { X, Clock as ClockIcon, Info } from 'lucide-react';

interface PresentationViewProps {
  data: PresentationData;
  onExit: () => void;
}

function parseTimeToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function PresentationView({ data, onExit }: PresentationViewProps) {
  const [now, setNow] = useState(new Date());

  const { startTime, endTime } = useMemo(() => {
    const start = parseTimeToDate(data.startTime);
    const endWithExtra = parseTimeToDate(data.endTime);
    endWithExtra.setMinutes(endWithExtra.getMinutes() + (data.extraTime || 0));
    
    return {
      startTime: start,
      endTime: endWithExtra,
    };
  }, [data]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);


  const formatTime = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col p-8 md:p-12 lg:p-16 animate-in fade-in duration-500">
      <header className="flex justify-end items-start">
        <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Presentation">
          <X className="h-8 w-8" />
        </Button>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center gap-16">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium">Component Details</CardTitle>
                    <Info className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="text-5xl font-bold text-primary">
                    <p>{data.componentTitle}</p>
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="text-5xl font-bold text-primary">
                    <p>{data.qualification}</p>
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="text-5xl font-bold text-primary">
                    <p className="text-sm text-muted-foreground">Component Code</p>
                    <p>{data.componentCode}</p>
                  </div>
                   <Separator className="bg-primary/20" />
                  <div className="text-5xl font-bold text-primary">
                    <p className="text-sm text-muted-foreground">Centre Number</p>
                    <p>{data.centreNumber}</p>
                  </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium">Exam Timings</CardTitle>
                    <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="text-5xl font-bold space-y-6 pt-6">
                    <div className="flex justify-between"><span>Start Time</span> <span>{formatTime(startTime)}</span></div>
                    <div className="flex justify-between"><span>Finish Time</span> <span>{formatTime(endTime)}</span></div>
                    <div className="flex justify-between"><span>Extra Time</span> <span>{data.extraTime || 0} mins</span></div>
                </CardContent>
            </Card>
        </div>
      </main>

      <footer className="text-center">
        <Clock />
      </footer>
    </div>
  );
}
