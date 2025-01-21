import {
    Card,
    HStack,
    Stack,
    Table,
    Input,
} from "@chakra-ui/react";

import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination";

import {
    ActionBarContent,
    ActionBarRoot,
    ActionBarSelectionTrigger,
    ActionBarSeparator,
} from "@/components/ui/action-bar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { BiListPlus } from "react-icons/bi";

interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
}

interface TableProps {
    title: string;
    data: unknown[];
    columns: TableColumn[];
    onAdd?: () => void;
    actions?: React.ReactNode;
}

const TableComponent: React.FC<TableProps> = ({ title, data, columns, onAdd, actions }) => {
    const [selection, setSelection] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < data.length;

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev && prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    return (
        <>
            <Card.Root width={"50vw"}>
                <Card.Body>
                    <Stack>
                        <HStack>
                            <Input placeholder={`Filter ${title.toLowerCase()} by name`} />
                            {onAdd && (
                                <Button onClick={onAdd} colorScheme="teal" color={"blackAlpha.700"}>
                                    <BiListPlus />
                                    Add New {title}
                                </Button>
                            )}
                        </HStack>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>
                                        <Checkbox
                                            checked={indeterminate ? undefined : selection.length > 0}
                                            onChange={(e) => {
                                                setSelection(
                                                    (e.target as HTMLInputElement).checked ? data.map((item) => item.id) : []
                                                );
                                            }}
                                        />
                                    </Table.ColumnHeader>
                                    {columns.map((col) => (
                                        <Table.ColumnHeader
                                            key={col.key}
                                            onClick={() => col.sortable && handleSort(col.key)}
                                            style={{ cursor: col.sortable ? "pointer" : "default" }}
                                        >
                                            {col.label}
                                        </Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {sortedData.map((item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>
                                            <Checkbox
                                                checked={selection.includes(item.id)}
                                                onChange={(e) => {
                                                    setSelection((prev) =>
                                                        e.target.checked
                                                            ? [...prev, item.id]
                                                            : prev.filter((id) => id !== item.id)
                                                    );
                                                }}
                                            />
                                        </Table.Cell>
                                        {columns.map((col) => (
                                            <Table.Cell key={col.key}>{item[col.key]}</Table.Cell>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                        <ActionBarRoot open={hasSelection}>
                            <ActionBarContent>
                                <ActionBarSelectionTrigger>
                                    {selection.length} selected
                                </ActionBarSelectionTrigger>
                                <ActionBarSeparator />
                                {actions}
                            </ActionBarContent>
                        </ActionBarRoot>

                        <PaginationRoot count={data.length} pageSize={5} page={1}>
                            <HStack justify="center">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </HStack>
                        </PaginationRoot>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </>
    );
};

export default TableComponent;
