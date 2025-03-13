import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

interface SessionTimerProps {
  onTimeout: () => void;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let lastActivity = Date.now();

    const resetTimer = () => {
      setTimeLeft(20 * 60);
      lastActivity = Date.now();
    };

    const checkActivity = () => {
      if (Date.now() - lastActivity >= 20 * 60 * 1000) {
        setIsActive(false);
        onTimeout();
      }
    };

    const activityHandler = () => {
      resetTimer();
    };

    // Add activity listeners
    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keypress', activityHandler);
    window.addEventListener('click', activityHandler);

    timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          checkActivity();
          return 0;
        }
        return prevTime - 1;
      });
      checkActivity();
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keypress', activityHandler);
      window.removeEventListener('click', activityHandler);
    };
  }, [onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TimerIcon fontSize="small" />
      <Typography variant="body2">
        Session: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
    </Box>
  );
};
