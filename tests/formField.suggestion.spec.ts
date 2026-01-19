import { mount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import FormField from "@/components/FormElements/FormField.vue";
import type { FormField as FormFieldType } from "@/types/forms";

const stubs = {
  UIIconComponent: { template: "<span><slot /></span>", props: ["icon", "color"] },
  UISmartSuggestion: {
    template:
      '<button class="suggestion" @click="$emit(\'click\')">{{ suggestion }}</button>',
    props: ["suggestion"],
  },
  FormElementsLocationSearch: {
    template: "<div class='location-search'></div>",
    props: ["modelValue"],
  },
  ClientOnly: { template: "<slot />" },
};

const addressSuggestion = {
  geometry: { coordinates: [2.35, 48.85], type: "Point" },
  properties: { label: "12 rue du Test, 75000 Paris" },
  type: "Feature",
};

const baseField: FormFieldType = {
  id: "loc",
  path: "situation_pro_fiscale.lieu_imposition",
  label: "Lieu",
  name: "lieu",
  type: "location",
  required: false,
};

describe("FormField suggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("renders address suggestion and highlights on selection", async () => {
    const wrapper = mount(FormField, {
      props: {
        formField: baseField,
        suggestion: addressSuggestion,
        modelValue: {},
        highlightPaths: [],
      },
      global: { stubs },
    });

    expect(wrapper.find(".suggestion").exists()).toBe(true);
    await wrapper.find(".suggestion").trigger("click");
    await nextTick();

    const vm = wrapper.vm as any;
    expect(
      vm.model?.situation_pro_fiscale?.lieu_imposition,
    ).toEqual(addressSuggestion);

    expect(wrapper.find(".form-field").classes()).toContain(
      "form-field--prefill",
    );

    vi.runAllTimers();
    await nextTick();
    expect(wrapper.find(".form-field").classes()).not.toContain(
      "form-field--prefill",
    );

    expect(wrapper.find(".suggestion").exists()).toBe(false);
  });
});
