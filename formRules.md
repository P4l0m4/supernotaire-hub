# Formatting
- Use lowercase snake_case for `path` with dot segments (`foo.bar`), avoid accents, spaces, and dashes.
- Keep option values consistent across formDefinition, types, and docDefinition; use exact strings for selects.
- Prefer `Oui | Non` string unions for boolean-like selects rather than raw booleans.
- Validate dates/numbers: set `mode` for dates, `min/max/step` or `pattern` where applicable.
- Use `tooltip`/`tooltipLink` only if the field type supports it (text, checkbox, checkbox-group, select, array subfields).

# Visibility & Validation
- Always use `showIf`/`requiredIf` with `path` and `equals/in/contains/is`; never `field/value`.
- For array itemSchema fields, add `showIf`/`requiredIf` if conditional (supported in ArrayFieldRenderer).
- Use `requiredIf` instead of `required` when the field is conditional.
- Ensure hidden fields aren’t required and are cleared by DynamicForm (already handled).

# Types
- Mirror the JSON: match option strings exactly; structure nested objects according to dot-paths.
- Use `Oui | Non` unions where the form collects yes/no; avoid mixing booleans and strings.
- Update the corresponding `Checklist...` interface for every form change; keep type names aligned.

# DocDefinitions
- Add new fields with proper `when` conditions in `addInfo`/`addDoc`.
- Map technical values to display labels when needed (e.g., checkbox-group values).
- Keep document generation logic consistent with form visibility (e.g., only when `showIf` would display it).

# Checks to run after changes
- `npm run test -- formDefinitionPathsFormat.spec.ts`
- `npm run test -- checklist-schema.spec.ts`
- Relevant docDefinition spec if it exists.
