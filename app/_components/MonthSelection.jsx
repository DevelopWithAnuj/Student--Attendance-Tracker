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

function MonthSelection({ selectedMonth, onMonthChange }) {
  return (
    <div className="">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex gap-2 items-center text-slate-500 dark:text-gray-300"
          >
            <CalendarDays className="h-5 w-5" />
            {moment(selectedMonth).format("MMM yyyy")}
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
