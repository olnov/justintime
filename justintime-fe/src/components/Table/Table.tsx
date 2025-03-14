import {
    Card,
    HStack,
    Stack,
    Table,
    Input,
    Text,
} from "@chakra-ui/react";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@/components/ui/pagination";
import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
} from "@/components/ui/dialog";

// import {
//     PopoverBody,
//     PopoverContent,
//     PopoverRoot,
//     PopoverTitle,
//     PopoverTrigger,
// } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BiListPlus } from "react-icons/bi";
import { Column, DataItem, TableProps } from "@/types/table.types";



const TableComponent: React.FC<TableProps & {
    onDelete?: (id: string) => void;
    onEdit?: (item: DataItem) => void;
}> = ({ title, data, columns, onAdd, onDelete, onEdit }) => {

    // const [selection, setSelection] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [filteredData, setFilteredData] = useState<DataItem[]>(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    // const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    // const hasSelection = selection.length > 0;
    // const indeterminate = hasSelection && selection.length < data.length;

    useEffect(() => {
        setFilteredData(data);
    }, [data, isDialogOpen]);

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
        // setSelection([]);
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

    // Default callbacks if not provided
    const defaultDelete = (id: string) => {
        console.log("Delete item with id: ", id);
    };

    const defaultEdit = (item: DataItem) => {
        console.log("Edit item: ", item);
    };

    // Opens the delete confirmation dialog and saves the selected item's id
    const handleDeleteDialog = (id: string, item: DataItem) => {
        setSelectedId(id);
        // setSelectedItem(item);
        setSelectedName(String(item.name));
        setIsDialogOpen(true);
    };

    // Handles confirming deletion
    const handleConfirmDelete = () => {
        if (selectedId) {
            if (onDelete) {
                onDelete(selectedId);
            } else {
                defaultDelete(selectedId);
            }
            setIsDialogOpen(false);
            setSelectedId(null);
        }
    };

    // const handleMouseOver = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, value: string) => {
    //     alert(value);
    //     return (
    //         <Alert.Root status="info" title="This is the alert title">
    //             <Alert.Indicator />
    //             <Alert.Title>{value}</Alert.Title>
    //         </Alert.Root>
    //     )
    // };

    return (
        <>
            <Card.Root width="100%" margin="auto">
                <Card.Body>
                    <Stack>
                        <HStack>
                            <Input
                                placeholder={`Filter ${title.toLowerCase()} by name`}
                                onChange={handleFilter}
                            />
                            {onAdd && (
                                <Button onClick={onAdd} colorScheme="teal">
                                    <BiListPlus />
                                    Add New {title}
                                </Button>
                            )}
                        </HStack>
                        <Table.Root size="md" tableLayout="fixed">

                            <Table.Header>
                                <Table.Row>

                                    {columns.map((col) => (
                                        <Table.ColumnHeader
                                            key={col.key}
                                            onClick={() => col.sortable && handleSort(col.key)}
                                            style={{ cursor: col.sortable ? "pointer" : "default" }}
                                        >
                                            <Text fontWeight="semibold">{col.label}</Text>
                                        </Table.ColumnHeader>
                                    ))}
                                    {/* Replace checkbox header with an Actions header */}
                                    <Table.ColumnHeader>
                                        <Text fontWeight="semibold">Actions</Text>
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.ColumnGroup>
                                {/* Added a column for actions */}
                                <Table.Column width="120px" />
                                {columns.map((col) => (
                                    <Table.Column key={col.key} />
                                ))}
                            </Table.ColumnGroup>
                            <Table.Body>
                                {sortedData.map((item: unknown) => {
                                    const dataItem = item as DataItem;
                                    return (
                                        <Table.Row key={dataItem.id}>

                                            {columns.map((col: Column) => (
                                                <Table.Cell
                                                    key={col.key}
                                                    // onMouseOver={(e) =>
                                                    //     handleMouseOver(e, String(dataItem[col.key]))
                                                    // }
                                                >
                                                    <Text lineClamp={1}>
                                                        {String(dataItem[col.key])}
                                                    </Text>
                                                </Table.Cell>
                                            ))}
                                            {/* Actions cell with Edit and Delete buttons */}
                                            <Table.Cell>
                                                <Button
                                                    size="xs"
                                                    onClick={() => (onEdit ? onEdit(dataItem) : defaultEdit(dataItem))}
                                                    colorPalette={"green"}
                                                    variant={"subtle"}
                                                    mr={2}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    onClick={() => (handleDeleteDialog(dataItem.id, dataItem))}
                                                    colorPalette={"red"}
                                                    variant={"subtle"}
                                                >
                                                    Delete
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Root>

                        {/* Optionally, remove the ActionBarRoot if no longer needed */}
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
            {isDialogOpen && (
                <DialogRoot
                    open={isDialogOpen}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setIsDialogOpen(false);
                            setSelectedId(null);
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete item</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            Are you sure you want to delete this item?
                            <Text fontWeight="semibold" mt={2}>
                                {selectedName}
                            </Text>
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                colorPalette="red"
                                onClick={handleConfirmDelete}
                                mr={1}
                            >
                                Delete
                            </Button>
                            <Button
                                colorPalette="gray"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogRoot>
            )}
        </>
    );
};

export default TableComponent;
