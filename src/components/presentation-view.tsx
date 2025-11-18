"use client";

import type { ExamData, PresentationData } from '@/lib/types';
import { useEffect, useState } from 'react';
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

const ExamDetailsCard = ({ exam }: { exam: ExamData }) => {
  const { startTime, finishTime, finalFinishTime } = (() => {
    const start = parseTimeToDate(exam.startTime);
    const end = parseTimeToDate(exam.endTime);
    const endWithExtra = new Date(end.getTime());
    endWithExtra.setMinutes(endWithExtra.getMinutes() + (exam.extraTime || 0));
    
    return {
      startTime: start,
      finishTime: end,
      finalFinishTime: endWithExtra,
    };
  })();

  const formatTime = (date: Date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <Card className="w-full transform scale-[1.2]">
      <CardHeader className="pb-2">
        <CardTitle className="text-5xl font-medium flex items-center justify-between">
          <span>Component Details</span>
          <Info className="h-10 w-10 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="text-primary">
          <p className="text-3xl text-muted-foreground">Component Title</p>
          <p className="text-8xl font-bold">{exam.componentTitle}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-3xl text-muted-foreground">Qualification</p>
          <p className="text-8xl font-bold">{exam.qualification}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-3xl text-muted-foreground">Component Code</p>
          <p className="text-8xl font-bold">{exam.componentCode}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-3xl text-muted-foreground">Centre Number</p>
          <p className="text-8xl font-bold">{exam.centreNumber}</p>
        </div>
        <Separator className="my-8 bg-primary/20" />
        <CardTitle className="text-5xl font-medium flex items-center justify-between">
          <span>Exam Timings</span>
          <ClockIcon className="h-10 w-10 text-muted-foreground" />
        </CardTitle>
        <div className="text-primary pt-6">
          <p className="text-3xl text-muted-foreground">Start Time</p>
          <p className="text-8xl font-bold">{formatTime(startTime)}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-3xl text-muted-foreground">Finish Time</p>
          <p className="text-8xl font-bold">{formatTime(finishTime)}</p>
        </div>
        {exam.extraTime > 0 && (
          <>
            <Separator className="bg-primary/20" />
            <div className="text-primary">
              <p className="text-3xl text-muted-foreground">Extra Time</p>
              <p className="text-8xl font-bold">{formatTime(finalFinishTime)}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function PresentationView({ data, onExit }: PresentationViewProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);


  const gridColsClass = data.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col p-8 md:p-12 lg:p-16 animate-in fade-in duration-500">
      <header className="flex justify-end items-start">
        <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Presentation">
          <X className="h-10 w-10" />
        </Button>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center gap-16">
        <div className={`w-full max-w-full grid ${gridColsClass} gap-12 justify-center`}>
          {data.map((exam, index) => (
            <div key={index} className="flex justify-center">
              <ExamDetailsCard exam={exam} />
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center">
        <Clock />
      </footer>
    </div>
  );
}
