import { Heading } from "@chakra-ui/react";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"

const Teachers = () => {
  return (
    <>
      <Heading>Teachers</Heading>
      <BreadcrumbRoot>
        <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
        <BreadcrumbCurrentLink>Props</BreadcrumbCurrentLink>
      </BreadcrumbRoot>
    </>
  );
};

export default Teachers;