import { ref, shallowRef, provide, inject } from "vue";
const IMAGE_VIEWER_KEY = /* @__PURE__ */ Symbol(
  "imageViewer"
);
function useImageViewerProvider() {
  const imageViewerRef = ref(null);
  const imageViewerProps = shallowRef();
  const imageViewerVisible = ref(false);
  const opemImageViewer = (props) => {
    imageViewerProps.value = props || {};
    imageViewerVisible.value = true;
  };
  const removeImageViewer = () => {
    imageViewerProps.value = void 0;
    imageViewerVisible.value = false;
  };
  provide(IMAGE_VIEWER_KEY, {
    opemImageViewer,
    removeImageViewer,
    imageViewerRef
  });
  return {
    imageViewerRef,
    imageViewerProps,
    imageViewerVisible,
    opemImageViewer,
    removeImageViewer
  };
}
function useImageViewer() {
  return inject(IMAGE_VIEWER_KEY, null);
}
export {
  IMAGE_VIEWER_KEY,
  useImageViewer,
  useImageViewerProvider
};
