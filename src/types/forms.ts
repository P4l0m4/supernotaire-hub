import type { RangeOption } from "@/components/FormElements/RangeInput.vue";

type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "radio"
  | "textarea"
  | "checkbox-group"
  | "array"
  | "email"
  | "file"
  | "segmented-control"
  | "range"
  | "location";

export interface BaseField {
  path: string;
  id: string;
  suggestionRef?: string;
  label: string;
  name: string;
  // types "simples" autorisÃ©s uniquement
  type: Exclude<
    FieldType,
    | "array"
    | "number"
    | "range"
    | "checkbox-group"
    | "select"
    | "segmented-control"
    | "file"
    | "date"
  >;
  required?: boolean;
  requiredIf?: ShowIf;
  placeholder?: string;
  icon?: string;
  TS_TYPE?: string; // clÃ© extraction AI
  tooltip?: string;
  tooltipLink?: string; // si tooltip renvoie vers une doc
  pattern?: string; // validation par regex
  showIf?: ShowIf; // champ affichÃ© si la condition est vraie
}

// RÃ¨gles affichage conditionnel
export type ShowIf =
  | {
      path: string; // chemin absolu depuis la racine du modÃ¨le
      equals?: any; // valeur attendue (Ã©galitÃ© stricte)
      in?: any[]; // une des valeurs
      contains?: any; // inclusion (tableaux / strings)
      truthy?: boolean; // valeur considÃ©rÃ©e comme vraie (par dÃ©faut true)
    }
  | { not: ShowIf }
  | { all: ShowIf[] }
  | { any: ShowIf[] }
  | { or: ShowIf[] };

// Options textuelles pour des groupes de choix
export interface ChoiceOption {
  label: string;
  value: string;
  belongsTo?: string[]; // afficher les options selon une autre valeur
}

export interface CheckBoxField extends Omit<BaseField, "type"> {
  type: "checkbox";
}

export interface ArrayField extends Omit<BaseField, "type"> {
  type: "array";
  itemLabel?: string;
  itemSchema: { fields: BaseField[] };
  minItems?: number;
  maxItems?: number;
}

export interface NumberField extends Omit<BaseField, "type"> {
  type: "number";
  step?: number;
  min?: number;
  max?: number;
}

export interface FileField extends Omit<BaseField, "type"> {
  type: "file";
  accept?: string[]; // types de fichiers acceptÃ©s, ex: ['image/png', 'application/pdf']
  multiple?: boolean; // permet la sÃ©lection de plusieurs fichiers
}

export interface RangeField extends Omit<BaseField, "type"> {
  type: "range";
  options: RangeOption[];
}

export interface CheckBoxGroupField extends Omit<BaseField, "type"> {
  type: "checkbox-group";
  options: ChoiceOption[];
}

export interface SelectField extends Omit<BaseField, "type"> {
  type: "select";
  options: string[];
}

export interface SegmentedControlField extends Omit<BaseField, "type"> {
  type: "segmented-control";
  options: string[];
}

export interface DateField extends Omit<BaseField, "type"> {
  type: "date";
  mode: "year-picker" | "month-picker" | "date-picker";
}

export type FormField =
  | BaseField // text, radio, textarea, email, location
  | CheckBoxField
  | ArrayField
  | NumberField
  | RangeField
  | CheckBoxGroupField
  | SelectField
  | SegmentedControlField
  | FileField
  | DateField;

export interface FormDefinition {
  title: string;
  sections: Array<{
    id: string;
    label: string;
    fields: FormField[];
  }>;
}
