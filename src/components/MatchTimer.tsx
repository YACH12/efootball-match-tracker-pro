
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TimerDuration } from "@/types";
import { cn } from "@/lib/utils";
import { Play, Pause, RefreshCw } from "lucide-react";

interface MatchTimerProps {
  duration: TimerDuration;
  onComplete?: () => void;
  onTimeUpdate?: (timeRemaining: number) => void;
  className?: string;
}

const MatchTimer: React.FC<MatchTimerProps> = ({
  duration,
  onComplete,
  onTimeUpdate,
  className
}) => {
  // Convert minutes to milliseconds
  const totalTime = duration * 60 * 1000;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  
  // Calculate minutes and seconds from time remaining
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  // Format for display
  const displayMinutes = minutes.toString().padStart(2, "0");
  const displaySeconds = seconds.toString().padStart(2, "0");

  // Start/Stop timer
  const toggleTimer = () => {
    if (isCompleted) {
      resetTimer();
      return;
    }
    
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  // Start timer
  const startTimer = () => {
    if (!isRunning && !isCompleted) {
      setIsRunning(true);
    }
  };

  // Stop timer
  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  // Reset timer
  const resetTimer = () => {
    stopTimer();
    setTimeRemaining(totalTime);
    setIsCompleted(false);
  };

  // Handle timer completion
  useEffect(() => {
    if (timeRemaining <= 0 && isRunning) {
      stopTimer();
      setIsCompleted(true);
      setTimeRemaining(0);
      
      if (onComplete) {
        onComplete();
      }
      
      toast({
        title: "Match Time Complete!",
        description: `The ${duration}-minute match time has ended.`,
      });
    }
  }, [timeRemaining, isRunning, duration, onComplete]);

  // Update timer
  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now();
      const initialTimeRemaining = timeRemaining;
      
      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newTimeRemaining = Math.max(0, initialTimeRemaining - elapsed);
        
        setTimeRemaining(newTimeRemaining);
        
        if (onTimeUpdate) {
          onTimeUpdate(newTimeRemaining);
        }
        
        if (newTimeRemaining <= 0) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
        }
      }, 100);
    }
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  // Reset timer when duration changes
  useEffect(() => {
    resetTimer();
  }, [duration]);

  // Calculate progress percentage
  const progressPercentage = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <div className={cn("flex flex-col items-center space-y-4 w-full", className)}>
      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
        <div 
          className={cn(
            "h-2.5 rounded-full",
            isCompleted 
              ? "bg-red-500" 
              : isRunning 
                ? "bg-primary" 
                : "bg-primary/60"
          )} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="text-5xl font-bold match-timer-display tracking-wider">
        {displayMinutes}:{displaySeconds}
      </div>
      
      <div className="flex space-x-4">
        <Button
          onClick={toggleTimer}
          variant={isRunning ? "outline" : "default"}
          size="lg"
          className={cn(
            "w-40",
            isCompleted ? "bg-primary hover:bg-primary/90" : ""
          )}
        >
          {isCompleted ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5" /> Restart
            </>
          ) : isRunning ? (
            <>
              <Pause className="mr-2 h-5 w-5" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" /> {timeRemaining < totalTime ? "Resume" : "Start"}
            </>
          )}
        </Button>
        
        {!isCompleted && (
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RefreshCw className="mr-2 h-5 w-5" /> Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default MatchTimer;
