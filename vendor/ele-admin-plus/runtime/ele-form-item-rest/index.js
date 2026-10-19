import { defineComponent } from "vue";
import { useFormItemRest } from "../utils/hook";
const index = defineComponent({
  name: "EleFormItemRest",
  setup(_props, { slots }) {
    useFormItemRest();
    return () => slots.default?.();
  }
});
export {
  index as default
};
