import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';
import { generateDates } from '../utils/generate-dates';
import { HabitDay } from './HabitDay';

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const summaryDates = generateDates();
const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);

  useEffect(() => {
    api.get('summary').then((response) => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className="w-full flex">
      <div className="grid grid-row-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, key) => {
          return (
            <div
              key={key}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          );
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, 'day');
            });

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, key) => {
            return (
              <div
                key={key}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40"
              />
            );
          })}
      </div>
    </div>
  );
}
