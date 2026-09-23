import BasicDataTable from "@/components/table/basic-table";

export default function BasicTableLayout({
    columns,
    addButtonLabel,
    to,
    filter,
    pagination = true,
    state,
    filterCustom,
    searchKey=false,
    search=true,
    addPermission,
}) { 
    
    return (
        <BasicDataTable
            columns={columns}
            form={state.form}
            data={state.data}
            addButtonLabel={addButtonLabel}
            to={to}
            filter={filter}
            pagination={pagination ? state.pagination : false}
            refetch={state.refetch}
            loading={state.isFetching}
            filterCustom={filterCustom}
            searchKey={searchKey}
            search={search}
            addPermission={addPermission}
        />
    );
}
