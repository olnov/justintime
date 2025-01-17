import { Card, HStack, Heading, Stack, Table, Kbd, Input, Text } from "@chakra-ui/react";
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


const Schools = () => {
  const [selection, setSelection] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < items.length;

  const sortedItems = [...items].sort((a, b) => {
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

  const rows = sortedItems.map((item) => (
    <Table.Row
      key={item.name}
      data-selected={selection.includes(item.name) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox
          top="1"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name),
            );
          }}
        />
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.category}</Table.Cell>
      <Table.Cell>{item.price}</Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <Heading>Schools</Heading>
      <Card.Root>
        <Card.Body>
          <Card.Description>
            <Stack width="full" gap="5" minWidth={700}>
              <HStack>
                <Input placeholder="Filter school by name" />
                <Button aria-label="Search database" colorPalette="teal" size="md" variant="outline">
                  <BiListPlus />
                  <Text>Add New School</Text>
                </Button>
              </HStack>
              <Table.Root size="md">
                <Table.Header style={{ cursor: "pointer" }}>
                  <Table.Row>
                    <Table.ColumnHeader w="6">
                      <Checkbox
                        top="1"
                        aria-label="Select all rows"
                        checked={indeterminate ? "indeterminate" : selection.length > 0}
                        onCheckedChange={(changes) => {
                          setSelection(
                            changes.checked ? items.map((item) => item.name) : [],
                          );
                        }}
                      />
                    </Table.ColumnHeader>
                    <Table.ColumnHeader onClick={() => handleSort("name")}>
                      School Name
                    </Table.ColumnHeader>
                    <Table.ColumnHeader onClick={() => handleSort("category")}>
                      Address
                    </Table.ColumnHeader>
                    <Table.ColumnHeader onClick={() => handleSort("price")}>
                      Phone
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{rows}</Table.Body>
              </Table.Root>

              <ActionBarRoot open={hasSelection}>
                <ActionBarContent>
                  <ActionBarSelectionTrigger>
                    {selection.length} selected
                  </ActionBarSelectionTrigger>
                  <ActionBarSeparator />
                  <Button variant="outline" size="sm">
                    Delete <Kbd>⌫</Kbd>
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit <Kbd>T</Kbd>
                  </Button>
                </ActionBarContent>
              </ActionBarRoot>

              <PaginationRoot count={items.length * 5} pageSize={5} page={1} alignSelf={{ base: "center" }}>
                <HStack wrap="wrap">
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </Stack>
          </Card.Description>
        </Card.Body>
      </Card.Root>
    </>
  );
};

const items = [
  { id: 1, name: "VoiceUp", category: "г. Москва, ул. Нижняя Сыромятническая, дом 10, строение 8", price: "8(916)1027770" },
  { id: 2, name: "Vocal Makers", category: "TW80HR, 8 Kew Bridge Road", price: "+44750556555" },
  { id: 3, name: "Guitardo", category: "Somethere in Europe", price: "Moscow calling" },
  { id: 4, name: "Drummers", category: "London, Epoch Street 17", price: "+447505652277" },
  { id: 5, name: "Headphones", category: "Accessories", price: "8(916)1027770" },
];

export default Schools;
