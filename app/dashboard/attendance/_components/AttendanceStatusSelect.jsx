import React from 'react';

function AttendanceStatusSelect({ studentId, day, onAttendanceChange, initialStatus }) {
  const statuses = [
    { label: 'P', value: 'Present', color: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'A', value: 'Absent', color: 'bg-red-100 text-red-700 border-red-200' },
    { label: 'L', value: 'Late', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { label: 'O', value: 'On Leave', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: 'H', value: 'Holiday', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    onAttendanceChange(studentId, day, value === "" ? undefined : value);
  };

  return (
    <div className="flex items-center justify-center">
      <select
        value={initialStatus || ""}
        onChange={handleChange}
        className="text-xs border rounded p-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">-</option>
        {statuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AttendanceStatusSelect;
