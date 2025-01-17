import { Input, Stack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { useState } from "react";

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
  onSubmit: (data: Record<string, any>) => void;
}

const GeneralizedForm: React.FC<FormComponentProps> = ({
  title,
  fields,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(
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
    <DialogRoot isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody pb="4">
          <Stack gap="4">
            {fields.map((field) => (
              <Field key={field.name} label={field.label}>
                <Input
                  type={field.type || "text"}
                  placeholder={field.placeholder || ""}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              </Field>
            ))}
          </Stack>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default GeneralizedForm;
