import { useState, useEffect } from "react";
import { getSchools, createSchool } from "@/services/SchoolService";
import TableComponent from "@/components/Table";
import { Heading, Button, Input, Stack } from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog"
import { withMask } from "use-mask-input";
import { toaster } from "@/components/ui/toaster"

const Schools = () => {
  const [schools, setSchools] = useState<unknown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSchools();
  }, [isFormOpen]);

  const fetchSchools = async () => {
    if (token) {
      const data = await getSchools(token);
      setSchools(data);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  const onClose = () => {
    setIsFormOpen(false);
  };

  const handleSave = () => {
    console.log("School Data:", { schoolName, address, phone });
    if (!token) {
      throw new Error("You are not authenticated");
    }
    if (!schoolName) {
      toaster.create({
        title: "Required information missing",
        description: "School name is required",
        type: "error",
      });
      throw new Error("School name is required");
    }
    createSchool(token, schoolName, address, phone);
    setIsFormOpen(false);
  }

  return (
    <>
      <Heading>Schools</Heading>
      <TableComponent
        title="Schools"
        data={schools}
        columns={[
          { key: "name", label: "School Name", sortable: true },
          { key: "address", label: "Address", sortable: true },
          { key: "phone", label: "Phone", sortable: true },
        ]}
        onAdd={() => setIsFormOpen(true)}
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
      />
      <DialogRoot open={isFormOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>Add new school</DialogHeader>
          <DialogBody pb="4">
            <Stack>
              <Input
                type="text"
                placeholder="School Name"
                name="name"
                value={schoolName}
                required = {true}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Input
                type="phone"
                placeholder="9(999)999-9999"
                ref={withMask("9(999)999-9999")}
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={"outline"} bgColor="green.300" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" bgColor={"red.300"} onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );

};

export default Schools;
