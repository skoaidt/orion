import React from "react";
import "./dataTable.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import CodeOffIcon from "@mui/icons-material/CodeOff";

const DataTable = ({ columns, rows, onRowClick, slug }) => {
  const newColumns = columns
    .filter((column) => column.field !== "descrip")
    .map((column) =>
      column.field === "complete"
        ? {
            ...column,
            renderCell: (params) => {
              switch (params.value) {
                case 0:
                  return <CloseIcon style={{ color: "tomato" }} />;
                case 1:
                  return <CodeIcon style={{ color: "orange" }} />;
                case 2:
                  return <CheckIcon style={{ color: "green" }} />;
                case 3:
                  return <CodeOffIcon style={{ color: "grey" }} />;
                default:
                  return null;
              }
            },
            headerAlign: "center",
            align: "center",
          }
        : { ...column, headerAlign: "center", align: "center" }
    );

  // 행 클릭 핸들러 함수
  const handleRowClick = (params) => {
    if (typeof onRowClick === "function") {
      onRowClick(params.row);
    }
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={rows}
        columns={newColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        components={{
          Toolbar: GridToolbar,
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        // pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick={false}
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
        autoHeight
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default DataTable;
