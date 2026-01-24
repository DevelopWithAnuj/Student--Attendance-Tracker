"use client";
import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Input } from "@/components/ui/input";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Search } from "lucide-react";
import GlobalApi from "@/app/_services/GlobalApi"; // Keep for future use if refreshData changes
import CustomButtons from "./CustomButtons";

ModuleRegistry.registerModules([AllCommunityModule]);

const StudentListTable = ({ studentList, courseList, branchList, yearList, refreshData }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const gridApiRef = useRef(null);
  const [columnDef, setColumnDef] = useState([]);


  // Set row data from studentList prop
  useEffect(() => {
    if (studentList) {
      setRowData(studentList);
    }
  }, [studentList]);

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
            courses={courseList} // Use props
            branches={branchList} // Use props
            years={yearList} // Use props
            onDeleteSuccess={refreshData} // Use prop
          />
        ),
      },
    ]);
  }, [courseList, branchList, yearList, studentList, refreshData]); // Add refreshData to dependencies

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const [searchInput, setSearchInput] = useState("");

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 486, width: "100%", marginTop: "20px" }}>
      <div className="flex gap-2 items-center mb-4 w-full sm:max-w-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search on Anything..."
          onChange={(e) => {
            const v = e.target.value;
            setSearchInput(v);
              // use the stored GridApi and guard the call
              if (gridApiRef.current && typeof gridApiRef.current.setQuickFilter === "function") {
              gridApiRef.current.setQuickFilter(v);
            }
          }}
          value={searchInput}
          className="p-2"
        />
      </div>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDef}
          quickFilterText={searchInput}
          pagination={true}
          paginationPageSize={10}
          paginationAutoPageSize={true}
          onGridReady={onGridReady} // ensure this is set
        />
      </div>
    </div>
  );
};

export default StudentListTable;
