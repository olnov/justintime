import {
    Input,
    Stack,
    Button,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import {
    // DialogActionTrigger,
    DialogBody,
    // DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    // DialogTitle,
    // DialogTrigger,
  } from "@/components/ui/dialog"
  
  interface FormField {
    label: string;
    name: string;
    type?: string; // e.g., 'text', 'number', 'email', etc.
    placeholder?: string;
    defaultValue?: string | number;
  }
  
  interface FormComponentProps {
    title: string;
    fields: FormField[];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Record<string, unknown>) => void;
  }
  
  const GeneralizedForm: React.FC<FormComponentProps> = ({
    title,
    fields,
    isOpen,
    onClose,
    onSubmit,
  }) => {
    const [formData, setFormData] = useState<Record<string, string | number>>(
      fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || "" }), {})
    );
  
    const handleChange = (name: string, value: string | number) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSave = () => {
      onSubmit(formData);
      onClose();
    };
  
    return (
    <DialogRoot open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>{title}</DialogHeader>
          <DialogBody pb="4">
            <Stack>
              {fields.map((field) => (
                <Stack key={field.name}>
                  <label>{field.label}</label>
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder || ""}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                </Stack>
              ))}
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    );
  };
  
  export default GeneralizedForm;
  