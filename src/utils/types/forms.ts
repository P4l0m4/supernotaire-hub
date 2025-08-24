type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "array"
  | "email"
  | "file";

export interface BaseField {
  path: string;
  id: string;
  suggestionRef?: string;
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
  accept?: string[]; // pour file
  multiple?: boolean; // pour file
  TS_TYPE?: string; // pour extraction AI
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
