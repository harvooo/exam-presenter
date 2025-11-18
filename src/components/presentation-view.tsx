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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-medium flex items-center justify-between">
          <span>Component Details</span>
          <Info className="h-6 w-6 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="text-primary">
          <p className="text-xl text-muted-foreground">Component Title</p>
          <p className="text-4xl font-bold">{exam.componentTitle}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-xl text-muted-foreground">Qualification</p>
          <p className="text-4xl font-bold">{exam.qualification}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-xl text-muted-foreground">Component Code</p>
          <p className="text-4xl font-bold">{exam.componentCode}</p>
        </div>
        <Separator className="bg-primary/20" />
        <div className="text-primary">
          <p className="text-xl text-muted-foreground">Centre Number</p>
          <p className="text-4xl font-bold">{exam.centreNumber}</p>
        </div>
        <Separator className="my-4 bg-primary/20" />
        <CardTitle className="text-2xl font-medium flex items-center justify-between">
          <span>Exam Timings</span>
          <ClockIcon className="h-6 w-6 text-muted-foreground" />
        </CardTitle>
        <div className="text-primary pt-2 space-y-3">
            <div>
                <p className="text-xl text-muted-foreground">Start Time</p>
                <p className="text-4xl font-bold">{formatTime(startTime)}</p>
            </div>
            <Separator className="bg-primary/20" />
            <div>
                <p className="text-xl text-muted-foreground">Finish Time</p>
                <p className="text-4xl font-bold">{formatTime(finishTime)}</p>
            </div>
            {exam.extraTime > 0 && (
            <>
                <Separator className="bg-primary/20" />
                <div>
                    <p className="text-xl text-muted-foreground">Extra Time</p>
                    <p className="text-4xl font-bold">{formatTime(finalFinishTime)}</p>
                </div>
            </>
            )}
        </div>
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
    <div className="fixed inset-0 bg-background text-foreground flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
      <header className="flex-shrink-0 flex justify-end items-start">
        <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Presentation">
          <X className="h-10 w-10" />
        </Button>
      </header>
      
      <main className="flex-1 overflow-y-auto py-4">
        <div className={`w-full max-w-7xl mx-auto grid ${gridColsClass} gap-8 items-start`}>
          {data.map((exam, index) => (
            <div key={index}>
              <ExamDetailsCard exam={exam} />
            </div>
          ))}
        </div>
      </main>

      <footer className="flex-shrink-0 text-center py-2">
        <Clock />
      </footer>
    </div>
  );
}
