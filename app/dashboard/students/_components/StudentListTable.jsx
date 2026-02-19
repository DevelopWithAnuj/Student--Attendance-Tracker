"use client";
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"; // Add forwardRef, useImperativeHandle
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Input } from "@/components/ui/input";
// Removed Button import
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Search } from "lucide-react";
import GlobalApi from "@/app/_services/GlobalApi";
import CustomButtons from "./CustomButtons";
import moment from "moment";


ModuleRegistry.registerModules([AllCommunityModule]);

// Wrap the component with forwardRef
const StudentListTable = forwardRef(({ studentList, refreshData }, ref) => {
  const [rowData, setRowData] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const gridRef = useRef(null);
  const gridApiRef = useRef(null);
  // Removed exportButtonRef
  const [columnDef, setColumnDef] = useState([]);


  // Fetch lists on mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [coursesRes, branchesRes, yearsRes] = await Promise.all([
          GlobalApi.GetAllCourses(),
          GlobalApi.GetAllBranches(),
          GlobalApi.GetAllYears(),
        ]);
        setCourseList(coursesRes.data.result || []);
        setBranchList(branchesRes.data.result || []);
        setYearList(yearsRes.data.result || []);
      } catch (error) {
        console.error("Failed to fetch lists:", error);
      }
    };
    fetchLists();
  }, []);

  // Set row data from studentList prop
  useEffect(() => {
    if (studentList) {
      const transformedData = studentList.map(student => {
        const courseId = student.courseId || student.course?.id;
        const branchId = student.branchId || student.branch?.id;
        const yearId = student.yearId || student.year?.id;
  
        const courseName = courseList.find(c => c.id === courseId)?.name;
        const branchName = branchList.find(b => b.id === branchId)?.name;
        const yearValue = yearList.find(y => y.id === yearId)?.value;
  
        return {
          ...student,
          course: courseName || (typeof student.course === 'string' ? student.course : courseId),
          branch: branchName || (typeof student.branch === 'string' ? student.branch : branchId),
          year: yearValue || (typeof student.year === 'string' ? student.year : yearId),
        };
      });
      setRowData(transformedData);
    }
  }, [studentList, courseList, branchList, yearList]);

  // Set column definitions
  useEffect(() => {
    setColumnDef([
      { headerName: "ID", field: "id", sortable: true, filter: true, pinned: 'left', width: 100 },
      { headerName: "Name", field: "name", sortable: true, filter: true, pinned: 'left', width: 150 },
      { headerName: "Email", field: "email", sortable: true, filter: true },
      { headerName: "Phone", field: "phone", sortable: true, filter: true },
      {
        headerName: "Course",
        field: "course",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Branch",
        field: "branch",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Year",
        field: "year",
        sortable: true,
        filter: true,
      },
      { headerName: "Address", field: "address", sortable: true, filter: true },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => (
          <CustomButtons 
            rowData={params.data}
            courses={courseList}
            branches={branchList}
            years={yearList}
            onDeleteSuccess={refreshData}
          />
        ),
      },
    ]);
  }, [courseList, branchList, yearList, refreshData]);

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const [searchInput, setSearchInput] = useState("");

  // Expose the CSV export function via useImperativeHandle
  useImperativeHandle(ref, () => ({
    triggerCsvExport: () => {
      if (gridApiRef.current) {
        const filename = `students_data_${moment().format("YYYY_MM_DD")}.csv`;
        gridApiRef.current.exportDataAsCsv({ fileName: filename });
      }
    },
    triggerPdfExport: async () => {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.text("Student List", 14, 10);

      const tableColumn = columnDef.map(col => col.headerName).filter(name => name !== "Actions");
      const tableRows = rowData.map(row => 
        columnDef.filter(col => col.field !== "actions").map(col => row[col.field])
      );

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: "bold",
        },
      });

      doc.save(`students_data_${moment().format("YYYY_MM_DD")}.pdf`);
    }
  }));

  // Removed onFirstDataRendered and related useEffect

  return (
    <div>
      <div className="flex gap-2 items-center mb-4 w-full sm:max-w-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search on Anything..."
          onChange={(e) => {
            const v = e.target.value;
            setSearchInput(v);
              if (gridApiRef.current && typeof gridApiRef.current.setQuickFilter === "function") {
              gridApiRef.current.setQuickFilter(v);
            }
          }}
          value={searchInput}
          className="p-2"
        />
      </div>
      <div className="ag-theme-alpine" style={{ height: "calc(100vh - 250px)", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDef}
          quickFilterText={searchInput}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );}); // End of forwardRef wrapper

export default StudentListTable;
