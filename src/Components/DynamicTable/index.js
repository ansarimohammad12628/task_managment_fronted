import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DynamicTable = ({ data = [], columns = [], loading = false }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={5}
      loading={loading}
      responsiveLayout="scroll"
      className="p-datatable-main"
      tableStyle={{ tableLayout: "auto" }}
    >
      {columns.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          body={col.body}
          style={col.style}
          className={col.className}
          headerClassName={col.className}
          sortable={col.sortable !== false}
        />
      ))}
    </DataTable>
  );
};

export default DynamicTable;