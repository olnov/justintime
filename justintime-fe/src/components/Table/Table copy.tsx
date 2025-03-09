import {
    Card,
    HStack,
    Stack,
    Table,
    Input,
    Text,
    Alert,
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

// import {
//     PopoverBody,
//     PopoverContent,
//     PopoverRoot,
//     PopoverTitle,
//     PopoverTrigger,
// } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { BiListPlus } from "react-icons/bi";
import { Column, DataItem, TableProps } from "@/types/table.types";



const TableComponent: React.FC<TableProps> = ({ title, data, columns, onAdd, actions }) => {
    
    const [selection, setSelection] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [filteredData, setFilteredData] = useState<DataItem[]>(data);

    const hasSelection = selection.length > 0;
    const indeterminate = hasSelection && selection.length < data.length;

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const aValue = (a as Record<string, unknown>)[key] as string | number;
        const bValue = (b as Record<string, unknown>)[key] as string | number;

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (!value) {
            setFilteredData(data);
            return;
        }
        const newFilteredData = data.filter((item: DataItem) => {
            return Object.values(item).some((val) => {
                if (typeof val === "string") {
                    return val.toLowerCase().includes(value);
                }
                return false;
            });
        });
        setSortConfig(null);
        setSelection([]);
        setFilteredData(newFilteredData);
    };

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev && prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const handleMouseOver = (e:React.MouseEvent<HTMLTableCellElement, MouseEvent>, value:string) => {
        // alert(value);
        // return (
        //     <Alert.Root status="info" title="This is the alert title">
        //         <Alert.Indicator />
        //         <Alert.Title>{value}</Alert.Title>
        //     </Alert.Root>
        // )
    };

    return (
        <>
            <Card.Root width={"100%"} margin={"auto"}>
                <Card.Body>
                    <Stack>
                        <HStack>
                            <Input placeholder={`Filter ${title.toLowerCase()} by name`} onChange={(e) => handleFilter(e)} />
                            {onAdd && (
                                <Button onClick={onAdd} colorScheme="teal">
                                    <BiListPlus />
                                    Add New {title}
                                </Button>
                            )}
                        </HStack>
                        <Table.Root size={"md"} tableLayout={"fixed"}>
                            <Table.ColumnGroup>
                                <Table.Column width={"50px"} />
                                {columns.map((col) => (
                                    <Table.Column key={col.key} />
                                ))}
                            </Table.ColumnGroup>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>
                                        <Checkbox
                                            checked={indeterminate ? undefined : selection.length > 0}
                                            onChange={(e) => {
                                                setSelection(
                                                    (e.target as HTMLInputElement).checked ? data.map((item) => (item as DataItem).id) : []
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
                                            <Text fontWeight={"semibold"}>{col.label}</Text>
                                        </Table.ColumnHeader>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {sortedData.map((item: unknown) => {
                                    const dataItem = item as DataItem;
                                    return (
                                        <Table.Row key={dataItem.id}>
                                            <Table.Cell>
                                                <Checkbox
                                                    checked={selection.includes(dataItem.id)}
                                                    onChange={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        setSelection((prev) =>
                                                            target.checked
                                                                ? [...prev, dataItem.id]
                                                                : prev.filter((id) => id !== dataItem.id)
                                                        );
                                                    }}
                                                />
                                            </Table.Cell>
                                            {columns.map((col: Column) => (
                                                <Table.Cell key={col.key} onMouseOver={(e) => {handleMouseOver(e, String(dataItem[col.key])); }}>
                                                    <Text lineClamp={1}>
                                                        {String(dataItem[col.key])}
                                                    </Text>
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    );
                                })}
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
