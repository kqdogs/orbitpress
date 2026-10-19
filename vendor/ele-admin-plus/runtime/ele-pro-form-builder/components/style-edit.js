import { defineComponent, ref, watch, openBlock, createElementBlock, Fragment, renderList, createVNode, unref, createCommentVNode, createElementVNode, withCtx, createTextVNode, toDisplayString } from "vue";
import { ElInput, ElIcon, ElButton } from "element-plus";
import { DeleteOutlined, PlusOutlined } from "../../icons/index";
const _hoisted_1 = {
  key: 0,
  class: "ele-pro-form-builder-style-edit-list"
};
const _hoisted_2 = {
  key: 0,
  class: "ele-pro-form-builder-style-edit-item-body"
};
const _hoisted_3 = { class: "ele-pro-form-builder-style-edit-item-body" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "StyleEdit" },
  __name: "style-edit",
  props: {
    modelValue: {},
    isClass: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    let itemStartId = 0;
    const props = __props;
    const emit = __emit;
    const data = ref([]);
    const updateModelValue = (value) => {
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
      }
    };
    const updateDataValue = (dataList) => {
      let isChanged = false;
      const temp = [...data.value];
      if (props.isClass) {
        dataList.forEach((d) => {
          const index = temp.findIndex((t) => d.value === t.value);
          if (index === -1) {
            itemStartId++;
            temp.push({ ...d, id: itemStartId });
            isChanged = true;
          }
        });
        temp.forEach((t, i) => {
          if (t.value != null && t.value.trim().length) {
            if (!dataList.some((d) => d.value === t.value)) {
              temp.splice(i, 1);
              isChanged = true;
            }
          }
        });
      } else {
        dataList.forEach((d) => {
          const index = temp.findIndex(
            (t) => d.name === t.name && d.value === t.value
          );
          if (index === -1) {
            itemStartId++;
            temp.push({ ...d, id: itemStartId });
            isChanged = true;
          }
        });
        temp.forEach((t, i) => {
          if (t.name != null && t.name.trim().length && t.value != null && t.value.trim().length) {
            if (!dataList.some((d) => d.name === t.name && d.value === t.value)) {
              temp.splice(i, 1);
              isChanged = true;
            }
          }
        });
      }
      if (isChanged) {
        data.value = temp;
      }
    };
    const getDataValue = (dataList, isClass) => {
      if (isClass) {
        const result2 = [];
        dataList.forEach((d) => {
          if (d.value != null && d.value.trim().length) {
            result2.push(d.value);
          }
        });
        return result2.join(" ");
      }
      const result = {};
      dataList.forEach((d) => {
        if (d.name != null && d.name.trim().length && d.value != null && d.value.trim().length) {
          result[d.name] = d.value;
        }
      });
      return result;
    };
    const getValueData = (value, isClass) => {
      const result = [];
      if (isClass) {
        const classValue = value || "";
        classValue.split(" ").forEach((d) => {
          if (d != null && d.trim().length) {
            result.push({ value: d });
          }
        });
        return result;
      }
      const styleValue = value || {};
      Object.keys(styleValue).forEach((k) => {
        const v = styleValue[k];
        if (v != null && !(typeof v === "string" && !v.trim().length)) {
          result.push({ name: k, value: String(v) });
        }
      });
      return result;
    };
    const handleDataListChange = () => {
      updateModelValue(getDataValue(data.value, props.isClass));
    };
    const handleDelete = (index) => {
      data.value.splice(index, 1);
      handleDataListChange();
    };
    const handleAdd = () => {
      itemStartId++;
      data.value.push({ name: "", value: "", id: itemStartId });
      handleDataListChange();
    };
    watch(
      () => props.modelValue,
      (value) => {
        updateDataValue(getValueData(value, props.isClass));
      },
      {
        deep: true,
        immediate: true
      }
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        data.value && data.value.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(data.value, (item, index) => {
            return openBlock(), createElementBlock("div", {
              key: item.id,
              class: "ele-pro-form-builder-style-edit-item"
            }, [
              !__props.isClass ? (openBlock(), createElementBlock("div", _hoisted_2, [
                createVNode(unref(ElInput), {
                  size: "small",
                  modelValue: item.name,
                  "onUpdate:modelValue": ($event) => item.name = $event,
                  onChange: handleDataListChange
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ])) : createCommentVNode("", true),
              createElementVNode("div", _hoisted_3, [
                createVNode(unref(ElInput), {
                  size: "small",
                  modelValue: item.value,
                  "onUpdate:modelValue": ($event) => item.value = $event,
                  onChange: handleDataListChange
                }, null, 8, ["modelValue", "onUpdate:modelValue"])
              ]),
              createVNode(unref(ElIcon), {
                class: "ele-pro-form-builder-style-edit-item-del-btn",
                title: "删除",
                onClick: ($event) => handleDelete(index)
              }, {
                default: withCtx(() => [
                  createVNode(unref(DeleteOutlined))
                ]),
                _: 1
              }, 8, ["onClick"])
            ]);
          }), 128))
        ])) : createCommentVNode("", true),
        createVNode(unref(ElButton), {
          size: "small",
          icon: unref(PlusOutlined),
          class: "ele-pro-form-builder-props-fluid-btn is-small-icon",
          onClick: handleAdd
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(__props.isClass ? "添加类名" : "添加样式"), 1)
          ]),
          _: 1
        }, 8, ["icon"])
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
