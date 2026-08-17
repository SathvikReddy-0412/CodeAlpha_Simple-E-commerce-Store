import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './FlashSaleTimer.css';

export const FlashSaleTimer = ({ targetHours = 8 }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="flash-sale-timer">
      <div className="timer-header">
        <Clock size={16} className="clock-icon" />
        <span>Flash Sale Ends In:</span>
      </div>
      <div className="timer-boxes">
        <div className="timer-box">
          <span className="timer-val">{formatNumber(timeLeft.hours)}</span>
          <span className="timer-unit">HRS</span>
        </div>
        <span className="timer-sep">:</span>
        <div className="timer-box">
          <span className="timer-val">{formatNumber(timeLeft.minutes)}</span>
          <span className="timer-unit">MIN</span>
        </div>
        <span className="timer-sep">:</span>
        <div className="timer-box">
          <span className="timer-val">{formatNumber(timeLeft.seconds)}</span>
          <span className="timer-unit">SEC</span>
        </div>
      </div>
    </div>
  );
};
