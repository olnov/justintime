// A set of types to be used in Table component
interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
}

export interface DataItem {
    id: string;
    [key: string]: number | string | boolean;
}

export interface Column {
    key: string;
    label: string;
}

export interface TableProps {
    title: string;
    data: DataItem[];
    columns: TableColumn[];
    onAdd?: () => void;
    actions?: React.ReactNode;
}