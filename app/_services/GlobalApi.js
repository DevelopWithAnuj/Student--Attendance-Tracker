const { default: axios } = require("axios");

const GetAllCourses = () => axios.get("/api/course");
const GetAllBranches = () => axios.get("/api/branch");
const GetAllYears = () => axios.get("/api/year");
const CreateNewStudent = (data) => axios.post("/api/student", data);
const GetAllStudents = (branch, course, year) => {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  if (course) params.append("course", course);
  if (year) params.append("year", year);
  return axios.get("/api/student", { params: params });
};
const GetAttendanceList = (courses, branches, years, month) => {
  return axios.get("/api/attendance", {
    params: {
      course: courses,
      branch: branches,
      year: years,
      month: month,
    },
  });
};

const takeAttendance = (data) => axios.post("/api/attendance", data);
const takeBulkAttendance = (data) => axios.post("/api/attendance/batch", data);

const DeleteStudentRecord = (id) => axios.delete(`/api/student?id=${id}`);
const UpdateStudent = (id, data) => axios.put(`/api/student?id=${id}`, data);
const GetDashboardSummary = (course, branch, year, month) => {
  return axios.get("/api/dashboard", {
    params: {
      course: course,
      branch: branch,
      year: year,
      month: month,
    },
  });
};

const GetAttendanceTrend = (course, branch, year, month) => {
  return axios.get("/api/attendance/trend", {
    params: {
      course: course,
      branch: branch,
      year: year,
      month: month,
    },
  });
};

const SyncDbSequence = () => axios.post("/api/debug/sync-sequence");

export default {
  GetAllCourses,
  GetAllBranches,
  GetAllYears,
  CreateNewStudent,
  GetAllStudents,
  DeleteStudentRecord,
  UpdateStudent,
  GetAttendanceList,
  takeAttendance,
  takeBulkAttendance,
  SyncDbSequence,
  GetDashboardSummary,
  GetAttendanceTrend,
};
