import {
  HStack,
  Stack,
  Table,
  Input,
  Text,
  Pagination,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState, useEffect } from "react";
import { BiListPlus } from "react-icons/bi";
import { Column, DataItem, TableProps } from "@/types/table.types";
import { useTranslation } from "react-i18next";

interface TableComponentProps extends TableProps {
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number,
  onAdd?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: DataItem) => void;
}


const TableComponent: React.FC<TableComponentProps> = ({
  title,
  data,
  columns,
  onAdd,
  onDelete,
  onEdit,
  currentPage = 1,
  pageSize = 10,
  onPageChange = () => { },
  totalCount = 0,
}) => {

  // const [selection, setSelection] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const totalPages = (Math.ceil(totalCount / pageSize))
  const { t } = useTranslation();

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

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

  return (
    <>
      <Stack>
        <HStack>
          <Input
            placeholder={t('table_filter')}
            onChange={handleFilter}
          />
          {onAdd && (
            <Button onClick={onAdd} colorScheme="teal">
              <BiListPlus />
              {/* Add New {title} */}
              {t('add_new', { entity: title })}
            </Button>
          )}
        </HStack>
        <Table.Root size="md" tableLayout="auto">
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
              <Table.ColumnHeader>
                <Text fontWeight="semibold">{t('actions')}</Text>
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.ColumnGroup>
            {/* Added a column for actions */}
            <Table.Column />
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
                      {t('edit')}
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => (handleDeleteDialog(dataItem.id, dataItem))}
                      colorPalette={"red"}
                      variant={"subtle"}
                    >
                      {t('delete')}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
        <Pagination.Root count={totalCount} pageSize={pageSize} page={currentPage}>
          <HStack justify={'center'}>
            <ButtonGroup variant="ghost" size="sm" wrap="wrap">
              <Pagination.PrevTrigger asChild>
                <IconButton aria-label="Previous page" onClick={handlePrevPage}>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton
                    aria-label={`Page ${page.value}`}
                    variant={page.value === currentPage ? "outline" : "ghost"}
                    onClick={() => onPageChange(page.value)}
                  >
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton aria-label="Next page" onClick={handleNextPage}>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </HStack>
        </Pagination.Root>
      </Stack>
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
              <DialogTitle>{t('delete_item')}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text>{t('delete_item_confirm')}</Text>
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
                {t('delete')}
              </Button>
              <Button
                colorPalette="gray"
                onClick={() => setIsDialogOpen(false)}
              >
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      )}
    </>
  );
};

export default TableComponent;
