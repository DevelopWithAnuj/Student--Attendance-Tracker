/**
 * Used to get Distict User List
 * @returns
 */

export const getUniqueRecord = (attendanceList) => {
  const uniqueRecord = [];
  const existingUser = new Set();
  attendanceList?.forEach((record) => {
    if (!existingUser.has(record.students.id)) {
      existingUser.add(record.students.id);
      uniqueRecord.push(record);
    }
  });
  return uniqueRecord;
};
