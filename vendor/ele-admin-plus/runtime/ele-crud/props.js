const crudProps = {
  /** 字段数据 */
  fields: Array,
  /** 列表配置 */
  listConfig: Object,
  /** 搜索栏配置 */
  searchConfig: {
    type: [Object, Boolean],
    default: () => {
      return null;
    }
  },
  /** 添加配置 */
  addConfig: {
    type: [Object, Boolean],
    default: () => {
      return null;
    }
  },
  /** 修改配置 */
  editConfig: {
    type: [Object, Boolean],
    default: () => {
      return null;
    }
  },
  /** 页面配置 */
  pageConfig: Object,
  /** 高级表单组件 */
  proFormComponent: [String, Object, Function],
  /** 表格数据接口 */
  listApi: [Array, Function, String],
  /** 删除数据接口 */
  deleteApi: [Function, String],
  /** 添加数据接口 */
  addApi: [Function, String],
  /** 修改数据接口 */
  editApi: [Function, String],
  /** 详情接口 */
  detailApi: [Function, String],
  /** 侧栏树组件数据接口 */
  treeListApi: [Array, Function, String],
  /** 消息提示组件属性 */
  messageOptions: Object,
  /** 高级表单组件类型数据 */
  itemTypeData: Array,
  /** 远程数据源请求工具 */
  httpRequest: [Object, Function],
  /** 屏幕尺寸 */
  screenSize: String,
  /** 国际化 */
  locale: Object
};
const crudEmits = {
  /** 表格多选数据改变事件 */
  tableSelectionsChange: (_selections) => true
};
export {
  crudEmits,
  crudProps
};
