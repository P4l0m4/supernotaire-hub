import { mount, shallowMount, VueWrapper } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DynamicForm from "@/components/FormElements/DynamicForm.vue";
import type { FormDefinition } from "@/types/forms";

// Stubs for child components we don't need to render
const stubs = {
  FormElementsFormSteps: {
    template: "<div></div>",
    props: ["stepsState"],
  },
  FormElementsFormField: {
    template: "<div></div>",
    props: ["formField", "suggestion", "validation", "modelValue"],
    emits: ["hasErrors", "update:modelValue"],
  },
  UIPrimaryButton: {
    template: "<button @click=\"$emit('click')\"><slot /></button>",
    props: ["variant", "icon"],
  },
  UISecondaryButton: {
    template: "<button><slot /></button>",
    props: ["variant", "icon", "reverse"],
  },
  UITertiaryButton: {
    template: "<button><slot /></button>",
    props: ["variant", "icon", "direction"],
  },
};

const formDefinition: FormDefinition = {
  title: "Test",
  sections: [
    {
      id: "section-1",
      label: "Section",
      fields: [
        {
          id: "toggle",
          path: "show_array",
          label: "Afficher le champ",
          name: "show_array",
          type: "checkbox",
        },
        {
          id: "array-field",
          path: "items",
          label: "Items",
          name: "items",
          type: "array",
          required: true,
          itemSchema: {
            fields: [
              {
                id: "item-label",
                path: "label",
                label: "Label",
                name: "label",
                type: "text",
                required: true,
              },
            ],
          },
          showIf: {
            path: "show_array",
            equals: true,
          },
        },
      ],
    },
  ],
};

const mountForm = () =>
  mount(DynamicForm, {
    props: {
      formDefinition,
      suggestions: [],
    },
    global: {
      stubs,
    },
  });

describe("DynamicForm showIf validation", () => {
  it("ignores errors from hidden fields", async () => {
    const wrapper = mountForm();
    const vm = wrapper.vm as any;

    // Force the array field visible (toggle on) and validate -> should fail (empty array)
    vm.model.show_array = true;
    let valid = await vm.validateCurrentSection();
    expect(valid).toBe(false);

    // Hide the array field (toggle off), validation should pass
    vm.model.show_array = false;
    valid = await vm.validateCurrentSection();
    expect(valid).toBe(true);
  });
});
