import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, expect, it, vi, beforeEach } from "vitest";
import DynamicForm from "@/components/FormElements/DynamicForm.vue";
import type { FormDefinition } from "@/types/forms";

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
  ClientOnly: {
    template: "<slot />",
  },
};

const baseForm = (fields: any[]): FormDefinition => ({
  title: "Test",
  sections: [
    {
      id: "section-1",
      label: "Section",
      fields,
    },
  ],
});

describe("DynamicForm validation extras", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  const fileFormDef = baseForm([
    {
      id: "f1",
      path: "doc",
      label: "Doc",
      name: "doc",
      type: "file",
      accept: ["application/pdf"],
      maxSizeMb: 1,
      required: true,
    },
  ]);

  it("validates file type and size", async () => {
    const mountFileForm = () =>
      mount(DynamicForm, {
        props: { formDefinition: fileFormDef, suggestions: [] },
        global: { stubs },
      });

    // Too large file
    let wrapper = mountFileForm();
    let vm = wrapper.vm as any;
    vm.model.doc = new File(["x".repeat(2 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });
    let valid = await vm.validateCurrentSection();
    expect(valid).toBe(false);
    wrapper.unmount();

    // Wrong mime
    wrapper = mountFileForm();
    vm = wrapper.vm as any;
    vm.model.doc = new File(["ok"], "image.png", { type: "image/png" });
    valid = await vm.validateCurrentSection();
    expect(valid).toBe(false);
    wrapper.unmount();

    // OK file
    wrapper = mountFileForm();
    vm = wrapper.vm as any;
    vm.model.doc = new File(["ok"], "fine.pdf", { type: "application/pdf" });
    valid = await vm.validateCurrentSection();
    expect(valid).toBe(true);
    wrapper.unmount();
  });

  it("showIf covers equals / contains / before-after", async () => {
    const formDefinition = baseForm([
      {
        id: "flag",
        path: "flags.value",
        label: "Flag",
        name: "flag",
        type: "checkbox",
      },
      {
        id: "multi",
        path: "multi",
        label: "Multi",
        name: "multi",
        type: "checkbox-group",
        options: [
          { label: "a", value: "a" },
          { label: "b", value: "b" },
        ],
      },
      {
        id: "date",
        path: "date",
        label: "Date",
        name: "date",
        type: "text",
      },
      {
        id: "target",
        path: "target",
        label: "Target",
        name: "target",
        type: "text",
        showIf: {
          all: [
            { path: "flags.value", equals: true },
            { path: "multi", contains: "a" },
            { path: "date", is: { before: "01-01-2020" } },
          ],
        },
        required: true,
      },
    ]);

    const wrapper = mount(DynamicForm, {
      props: { formDefinition, suggestions: [] },
      global: { stubs },
    });
    const vm = wrapper.vm as any;

    // Hidden initially -> validation passe
    let valid = await vm.validateCurrentSection();
    expect(valid).toBe(true);

    // Rendre le champ visible
    vm.model.flags = { value: true };
    vm.model.multi = ["a"];
    vm.model.date = "31-12-2019";
    await nextTick();
    valid = await vm.validateCurrentSection();
    expect(valid).toBe(false); // visible et requis mais vide

    // Remplir -> ok
    vm.model.target = "ok";
    await nextTick();
    // remonter le composant pour repartir d'un état propre et vérifier la validité
    wrapper.unmount();
    const remounted = mount(DynamicForm, {
      props: { formDefinition, suggestions: [] },
      global: { stubs },
    });
    const vm2 = remounted.vm as any;
    vm2.model.flags = { value: true };
    vm2.model.multi = ["a"];
    vm2.model.date = "31-12-2019";
    vm2.model.target = "ok";
    await nextTick();
    valid = await vm2.validateCurrentSection();
    expect(valid).toBe(true);

    // Cacher à nouveau (date après) -> validation passe même si vide
    vm.model.date = "02-01-2025";
    vm.model.target = "";
    await nextTick();
    valid = await vm.validateCurrentSection();
    expect(valid).toBe(true);
  });
});
