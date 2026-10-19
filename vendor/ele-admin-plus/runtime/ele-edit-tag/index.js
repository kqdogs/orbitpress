import { defineComponent, ref, onDeactivated, onActivated, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, unref, normalizeStyle, withCtx, createTextVNode, toDisplayString, createCommentVNode, withDirectives, renderSlot, createVNode, vShow, mergeProps, nextTick } from "vue";
import { ElTag, ElIcon, ElInput } from "element-plus";
import EleTooltip from "../ele-tooltip/index";
import { PlusOutlined, LoadingOutlined } from "../icons/index";
import { useFormValidate } from "../ele-basic-select/util";
import { editTagEmits, editTagProps } from "./props";
const _hoisted_1 = { key: 0 };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "EleEditTag" },
  __name: "index",
  props: editTagProps,
  emits: editTagEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { validateChange } = useFormValidate();
    const inputTagRef = ref(null);
    const inputRef = ref(null);
    const isEdit = ref(false);
    const inputValue = ref("");
    const errorMessage = ref("");
    const loading = ref(false);
    const tooltipVisible = ref(false);
    const isDeactivated = ref(false);
    const updateModelValue = (modelValue) => {
      emit("update:modelValue", modelValue);
      validateChange();
      emit("change", modelValue);
    };
    const addTag = (value) => {
      tooltipVisible.value = false;
      isEdit.value = false;
      updateInputValue("");
      errorMessage.value = "";
      loading.value = false;
      if (value) {
        const temp = props.modelValue ? [...props.modelValue] : [];
        temp.push(value);
        updateModelValue(temp);
      }
    };
    const removeTag = (index) => {
      if (!props.modelValue) {
        return;
      }
      const temp = [...props.modelValue];
      temp.splice(index, 1);
      updateModelValue(temp);
    };
    const updateInputValue = (value) => {
      inputValue.value = value;
    };
    const focusInput = () => {
      setTimeout(() => {
        inputRef.value && inputRef.value.focus();
      }, 0);
    };
    const handleAddClick = () => {
      if (props.disabled) {
        return;
      }
      tooltipVisible.value = false;
      errorMessage.value = "";
      isEdit.value = true;
      nextTick(() => {
        focusInput();
      });
    };
    const handleTagClose = (index, item) => {
      if (typeof props.beforeRemove !== "function") {
        removeTag(index);
        return;
      }
      props.beforeRemove(index, item).then(() => {
        removeTag(index);
      }).catch(() => {
      });
    };
    const handleTagClick = (index, item) => {
      emit("itemClick", index, item);
    };
    const handleInputChange = () => {
      if (!inputValue.value) {
        return;
      }
      if (typeof props.validator !== "function") {
        addTag(inputValue.value);
        return;
      }
      loading.value = true;
      props.validator(inputValue.value).then(() => {
        addTag(inputValue.value);
      }).catch((e) => {
        loading.value = false;
        if (e && e.message != null && e.message !== "") {
          errorMessage.value = e.message;
          if (isEdit.value && !isDeactivated.value) {
            tooltipVisible.value = true;
          }
        }
        nextTick(() => {
          focusInput();
        });
      });
    };
    const handleInputBlur = () => {
      tooltipVisible.value = false;
      if (!inputValue.value) {
        isEdit.value = false;
        errorMessage.value = "";
      }
    };
    const handleInputFocus = () => {
      if (errorMessage.value && !tooltipVisible.value && isEdit.value && !isDeactivated.value) {
        tooltipVisible.value = true;
      }
    };
    onDeactivated(() => {
      isDeactivated.value = true;
      tooltipVisible.value = false;
    });
    onActivated(() => {
      isDeactivated.value = false;
    });
    __expose({
      inputTagRef,
      inputRef
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["ele-edit-tag", [
          { "is-large": _ctx.size === "large" },
          { "is-small": _ctx.size === "small" },
          { "is-disabled": _ctx.disabled },
          { "is-readonly": _ctx.readonly }
        ]])
      }, [
        _ctx.modelValue ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(_ctx.modelValue, (item, index) => {
          return openBlock(), createBlock(unref(ElTag), {
            key: `${index}-${item}`,
            hit: _ctx.hit,
            type: _ctx.type,
            color: _ctx.color,
            size: _ctx.size,
            effect: _ctx.effect,
            round: _ctx.round,
            closable: _ctx.readonly || _ctx.disabled ? false : true,
            disableTransitions: true,
            style: normalizeStyle(_ctx.itemStyle),
            onClose: ($event) => handleTagClose(index, item),
            onClick: ($event) => handleTagClick(index, item)
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(item), 1)
            ]),
            _: 2
          }, 1032, ["hit", "type", "color", "size", "effect", "round", "closable", "style", "onClose", "onClick"]);
        }), 128)) : createCommentVNode("", true),
        !_ctx.readonly ? withDirectives((openBlock(), createBlock(unref(ElTag), {
          key: 1,
          hit: _ctx.hit,
          type: "info",
          size: _ctx.size,
          round: _ctx.round,
          disableTransitions: true,
          class: "ele-edit-tag-add",
          style: normalizeStyle(_ctx.buttonStyle),
          onClick: handleAddClick
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "placeholder", {}, () => [
              _ctx.placeholder ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.placeholder), 1)) : (openBlock(), createBlock(unref(ElIcon), {
                key: 1,
                class: "ele-edit-tag-add-icon"
              }, {
                default: withCtx(() => [
                  createVNode(unref(PlusOutlined))
                ]),
                _: 1
              }))
            ])
          ]),
          _: 3
        }, 8, ["hit", "size", "round", "style"])), [
          [vShow, !isEdit.value]
        ]) : createCommentVNode("", true),
        !_ctx.readonly ? withDirectives((openBlock(), createBlock(unref(ElTag), {
          key: 2,
          ref_key: "inputTagRef",
          ref: inputTagRef,
          size: _ctx.size,
          round: _ctx.round,
          disableTransitions: true,
          class: normalizeClass(["ele-edit-tag-input", { "is-error": !!errorMessage.value }]),
          style: normalizeStyle(_ctx.inputTagStyle)
        }, {
          default: withCtx(() => [
            createVNode(unref(ElInput), {
              ref_key: "inputRef",
              ref: inputRef,
              disabled: loading.value,
              modelValue: inputValue.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => inputValue.value = $event),
              validateEvent: false,
              style: normalizeStyle(_ctx.inputStyle),
              onChange: handleInputChange,
              onBlur: handleInputBlur,
              onFocus: handleInputFocus
            }, {
              suffix: withCtx(() => [
                loading.value ? (openBlock(), createBlock(unref(ElIcon), {
                  key: 0,
                  class: "is-loading"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(LoadingOutlined))
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ]),
              _: 1
            }, 8, ["disabled", "modelValue", "style"])
          ]),
          _: 1
        }, 8, ["size", "round", "class", "style"])), [
          [vShow, isEdit.value]
        ]) : createCommentVNode("", true),
        createVNode(EleTooltip, mergeProps({
          offset: 7,
          hideAfter: 0,
          trigger: "click",
          triggerKeys: [],
          disabled: !tooltipVisible.value
        }, _ctx.tooltipProps || {}, {
          virtualTriggering: true,
          virtualRef: inputTagRef.value ? inputTagRef.value.$el : void 0,
          content: errorMessage.value,
          visible: tooltipVisible.value
        }), null, 16, ["disabled", "virtualRef", "content", "visible"])
      ], 2);
    };
  }
});
export {
  _sfc_main as default
};
