'use client';

import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { FaPause, FaPlay, FaRedo } from 'react-icons/fa';
import useSound from 'use-sound';

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_SHORT_BREAK = 5 * 60;
const DEFAULT_LONG_BREAK = 15 * 60;
const POMODOROS_UNTIL_LONG_BREAK = 4;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [shortBreakTime, setShortBreakTime] = useState(DEFAULT_SHORT_BREAK);
  const [longBreakTime, setLongBreakTime] = useState(DEFAULT_LONG_BREAK);

  const [playStart] = useSound('/sounds/start.mp3');
  const [playPause] = useSound('/sounds/pause.mp3');
  const [playComplete] = useSound('/sounds/complete.mp3');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (isWork) {
      setTimeLeft(workTime);
    } else {
      setTimeLeft(pomodorosCompleted % POMODOROS_UNTIL_LONG_BREAK === 0 ? longBreakTime : shortBreakTime);
    }
  }, [isWork, workTime, shortBreakTime, longBreakTime, pomodorosCompleted]);

  const toggleTimer = () => {
    if (!isActive) {
      playStart();
    } else {
      playPause();
    }
    setIsActive(!isActive);
  };

  const completePomodoro = useCallback(() => {
    playComplete();
    if (isWork) {
      setPomodorosCompleted((prev) => prev + 1);
      setIsWork(false);
      setTimeLeft(pomodorosCompleted % POMODOROS_UNTIL_LONG_BREAK === 3 ? longBreakTime : shortBreakTime);
    } else {
      setIsWork(true);
      setTimeLeft(workTime);
    }
    setIsActive(false);
  }, [isWork, pomodorosCompleted, workTime, shortBreakTime, longBreakTime, playComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      completePomodoro();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, completePomodoro]);

  useEffect(() => {
    resetTimer();
  }, [workTime, shortBreakTime, longBreakTime, resetTimer]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Pomodoro Timer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-extrabold text-center text-gray-900">Pomodoro Timer</h1>
                <div className="text-6xl font-bold text-center text-gray-800">{formatTime(timeLeft)}</div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={toggleTimer}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                  >
                    {isActive ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                  >
                    <FaRedo />
                  </button>
                </div>
                <div className="text-center text-gray-600">
                  {isWork
                    ? 'Work Time'
                    : pomodorosCompleted % POMODOROS_UNTIL_LONG_BREAK === 0
                      ? 'Long Break'
                      : 'Short Break'}
                </div>
                <div className="flex justify-center space-x-2">
                  {[...Array(POMODOROS_UNTIL_LONG_BREAK)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        index < pomodorosCompleted % POMODOROS_UNTIL_LONG_BREAK ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="workTime" className="font-medium text-gray-700">
                      Work Time (minutes):
                    </label>
                    <input
                      type="number"
                      id="workTime"
                      value={workTime / 60}
                      onChange={(e) => setWorkTime(Number(e.target.value) * 60)}
                      className="w-20 px-2 py-1 text-right border rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="shortBreakTime" className="font-medium text-gray-700">
                      Short Break (minutes):
                    </label>
                    <input
                      type="number"
                      id="shortBreakTime"
                      value={shortBreakTime / 60}
                      onChange={(e) => setShortBreakTime(Number(e.target.value) * 60)}
                      className="w-20 px-2 py-1 text-right border rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="longBreakTime" className="font-medium text-gray-700">
                      Long Break (minutes):
                    </label>
                    <input
                      type="number"
                      id="longBreakTime"
                      value={longBreakTime / 60}
                      onChange={(e) => setLongBreakTime(Number(e.target.value) * 60)}
                      className="w-20 px-2 py-1 text-right border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
