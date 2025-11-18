"use client";

import type { PresentationData } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Clock } from '@/components/clock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Clock as ClockIcon, Calendar } from 'lucide-react';

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

  const { startTime, endTime, totalDuration, timeRemaining, progress, isFinished, hasStarted } = useMemo(() => {
    const start = parseTimeToDate(data.startTime);
    const endWithExtra = parseTimeToDate(data.endTime);
    endWithExtra.setMinutes(endWithExtra.getMinutes() + (data.extraTime || 0));

    const totalDurationMs = endWithExtra.getTime() - start.getTime();
    const hasStartedNow = now.getTime() >= start.getTime();
    
    let timeRemainingMs = endWithExtra.getTime() - now.getTime();
    if (!hasStartedNow) {
      timeRemainingMs = totalDurationMs;
    }
    
    const isFinishedNow = hasStartedNow && timeRemainingMs <= 0;
    if (isFinishedNow) timeRemainingMs = 0;
    
    const currentProgress = hasStartedNow ? Math.max(0, Math.min(100, ((totalDurationMs - timeRemainingMs) / totalDurationMs) * 100)) : 0;
    
    const seconds = Math.floor((timeRemainingMs / 1000) % 60);
    const minutes = Math.floor((timeRemainingMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeRemainingMs / (1000 * 60 * 60)));

    const timeRemainingFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    return {
      startTime: start,
      endTime: endWithExtra,
      totalDuration: totalDurationMs,
      timeRemaining: timeRemainingFormatted,
      progress: isFinishedNow ? 100 : currentProgress,
      isFinished: isFinishedNow,
      hasStarted: hasStartedNow
    };
  }, [data, now]);

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


  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col p-8 md:p-12 lg:p-16 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">{data.componentTitle}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">{data.qualification} | {data.componentCode}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Presentation">
          <X className="h-8 w-8" />
        </Button>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center gap-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Exam Details</CardTitle>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="text-2xl font-bold space-y-4 pt-4">
                    <div className="flex justify-between"><span>Start Time:</span> <span>{formatTime(startTime)}</span></div>
                    <div className="flex justify-between"><span>End Time:</span> <span>{formatTime(endTime)}</span></div>
                    <div className="flex justify-between"><span>Extra Time:</span> <span>{data.extraTime || 0} mins</span></div>
                </CardContent>
            </Card>
            <Card className={isFinished ? 'border-destructive bg-destructive/10' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Time Remaining</CardTitle>
                    <ClockIcon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex justify-center items-center h-full pt-4">
                  {
                    !hasStarted ? <p className="text-4xl font-bold text-muted-foreground">Not Started</p> :
                    isFinished ? <p className="text-4xl font-bold text-destructive">Time's Up!</p> :
                    <p className="font-mono text-5xl font-bold">{timeRemaining}</p>
                  }
                </CardContent>
            </Card>
        </div>
        
        <div className="w-full max-w-4xl">
          <Progress value={progress} className="h-4" />
        </div>
      </main>

      <footer className="text-center">
        <Clock />
      </footer>
    </div>
  );
}
