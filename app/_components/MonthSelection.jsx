"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { addMonths } from "date-fns";
import moment from "moment/moment";
import { Calendar } from "@/components/ui/calendar";

function MonthSelection({ selectedMonth, onMonthChange, id }) {
  return (
    <div className="">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full h-12 flex gap-3 items-center justify-start px-4 font-bold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm"
          >
            <CalendarDays className="h-5 w-5 text-primary" />
            {moment(selectedMonth).format("MMMM YYYY")}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            month={selectedMonth}
            onMonthChange={(value) => {
              onMonthChange(value); // Call the callback function
            }}
            className="flex flex-1 justify-center rounded-lg border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MonthSelection;
