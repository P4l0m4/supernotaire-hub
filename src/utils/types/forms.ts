type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "array"
  | "email";

export interface BaseField {
  path: string;
  id: string;
  label: string;
  name: string;
  type: Exclude<FieldType, "array">; // tous sauf "array"
  ui?: { prefix?: string };
  step?: number;
  min?: number;
  max?: number;
  options?: Array<string>; // pour select
  required?: boolean;
  placeholder?: string;
  icon?: string;
}

// Spécifique aux tableaux
export interface ArrayField extends Omit<BaseField, "type"> {
  type: "array";
  itemLabel?: string;
  itemSchema: { fields: BaseField[] };
  minItems?: number;
  maxItems?: number;
}

export type FormField = BaseField | ArrayField;

export interface FormDefinition {
  title: string;
  sections: Array<{
    id: string;
    label: string;
    fields: FormField[];
  }>;
}
