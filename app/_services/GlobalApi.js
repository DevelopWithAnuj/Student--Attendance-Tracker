const { default: axios } = require("axios");

const handleApiCall = async (axiosCall) => {
  try {
    const response = await axiosCall();
    return response;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error; // Re-throw to be caught by the calling component
  }
};

const GetAllCourses = () => handleApiCall(() => axios.get("/api/course"));
const CreateCourse = (data) => handleApiCall(() => axios.post("/api/course", data));
const UpdateCourse = (data) => handleApiCall(() => axios.put("/api/course", data));
const DeleteCourse = (id) => handleApiCall(() => axios.delete("/api/course", { data: { id } }));

const GetAllBranches = () => handleApiCall(() => axios.get("/api/branch"));
const CreateBranch = (data) => handleApiCall(() => axios.post("/api/branch", data));
const UpdateBranch = (data) => handleApiCall(() => axios.put("/api/branch", data));
const DeleteBranch = (id) => handleApiCall(() => axios.delete("/api/branch", { data: { id } }));

const GetAllYears = () => handleApiCall(() => axios.get("/api/year"));
const CreateYear = (data) => handleApiCall(() => axios.post("/api/year", data));
const UpdateYear = (data) => handleApiCall(() => axios.put("/api/year", data));
const DeleteYear = (id) => handleApiCall(() => axios.delete("/api/year", { data: { id } }));

const CreateNewStudent = (data) => handleApiCall(() => axios.post("/api/student", data));
const GetAllStudents = (branch, course, year) => {
  const params = new URLSearchParams();
  if (branch) params.append("branch", branch);
  if (course) params.append("course", course);
  if (year) params.append("year", year);
  return handleApiCall(() => axios.get("/api/student", { params: params }));
};
const GetAttendanceList = (courses, branches, years, month) => {
  return handleApiCall(() => axios.get("/api/attendance", {
    params: {
      course: courses,
      branch: branches,
      year: years,
      month: month,
    },
  }));
};

const takeAttendance = (data) => handleApiCall(() => axios.post("/api/attendance", data));
const takeBulkAttendance = (data) => handleApiCall(() => axios.post("/api/attendance/batch", data));

const DeleteStudentRecord = (id) => handleApiCall(() => axios.delete(`/api/student?id=${id}`));
const UpdateStudent = (id, data) => handleApiCall(() => axios.put(`/api/student?id=${id}`, data));
const GetDashboardSummary = (course, branch, year, month) => {
  return handleApiCall(() => axios.get("/api/dashboard", {
    params: {
      course: course,
      branch: branch,
      year: year,
      month: month,
    },
  }));
};

const GetAttendanceTrend = (course, branch, year, month) => {
  return handleApiCall(() => axios.get("/api/attendance/trend", {
    params: {
      course: course,
      branch: branch,
      year: year,
      month: month,
    },
  }));
};

const SyncDbSequence = () => handleApiCall(() => axios.post("/api/debug/sync-sequence"));

export default {
  GetAllCourses,
  CreateCourse,
  UpdateCourse,
  DeleteCourse,
  GetAllBranches,
  CreateBranch,
  UpdateBranch,
  DeleteBranch,
  GetAllYears,
  CreateYear,
  UpdateYear,
  DeleteYear,
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
