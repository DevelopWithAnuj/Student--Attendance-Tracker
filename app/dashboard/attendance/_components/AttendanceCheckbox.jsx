import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

function AttendanceCheckbox({ studentId, day, onAttendanceChange, initialPresent }) {
  const [present, setPresent] = useState(initialPresent === true);
  const [absent, setAbsent] = useState(initialPresent === false);

  useEffect(() => {
    setPresent(initialPresent === true);
    setAbsent(initialPresent === false);
  }, [initialPresent]);

  const handlePresentChange = (checked) => {
    setPresent(checked);
    if (checked) {
      setAbsent(false);
      onAttendanceChange(studentId, day, true);
    } else {
      // If unchecked, and absent is also unchecked, it means no attendance is marked
      // but we need to ensure that if absent was checked it remains unchecked
      // and if there was a previous value (true/false) it should be cleared
      if (!absent) { // only clear if absent was not checked
        onAttendanceChange(studentId, day, undefined);
      }
    }
  };

  const handleAbsentChange = (checked) => {
    setAbsent(checked);
    if (checked) {
      setPresent(false);
      onAttendanceChange(studentId, day, false);
    } else {
      // If unchecked, and present is also unchecked, it means no attendance is marked
      if (!present) { // only clear if present was not checked
        onAttendanceChange(studentId, day, undefined);
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="flex items-center space-x-1">
        <Checkbox id={`present-${studentId}-${day}`} checked={present} onCheckedChange={handlePresentChange} />
        <label htmlFor={`present-${studentId}-${day}`}>P</label>
      </div>
      <div className="flex items-center space-x-1">
        <Checkbox id={`absent-${studentId}-${day}`} checked={absent} onCheckedChange={handleAbsentChange} />
        <label htmlFor={`absent-${studentId}-${day}`}>A</label>
      </div>
    </div>
  );
}

export default AttendanceCheckbox;
