import { useState, useEffect } from "react";
import { getSchools, createSchool } from "@/services/SchoolService";
import TableComponent from "@/components/Table/Table";
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
import { DataItem } from "@/types/table.types"
import { useTranslation } from "react-i18next";

const Schools = () => {

  const [schools, setSchools] = useState<DataItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  // Pagination options
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchSchools();
  }, [isFormOpen]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const fetchSchools = async () => {
    if (token) {
      const skip = (currentPage - 1) * pageSize;
      const take = pageSize;
      const data = await getSchools(token, skip, take);
      setSchools(data.data);
      setTotalCount(data.totalCount);
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
      <Heading>{t('schools')}</Heading>
      <TableComponent
        title="Schools"
        data={schools}
        columns={[
          { key: "name", label: t('school'), sortable: true },
          { key: "address", label: t('address'), sortable: true },
          { key: "phone", label: t('phone'), sortable: true },
        ]}
        onAdd={() => setIsFormOpen(true)}
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        totalCount={totalCount}
      />
      <DialogRoot open={isFormOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>{t('add_new_school')}</DialogHeader>
          <DialogBody pb="4">
            <Stack>
              <Input
                type="text"
                placeholder={t('school_name')}
                name="name"
                value={schoolName}
                required={true}
                onChange={(e) => setSchoolName(e.target.value)}
              />
              <Input
                type="text"
                placeholder={t('address')}
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
              {t('save')}
            </Button>
            <Button variant="outline" bgColor={"red.300"} onClick={onClose}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );

};

export default Schools;
