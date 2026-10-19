const proTemplate = `<template>
  <pro-form
    v-bind="config"
    :model="form"
    @updateValue="setFieldValue"
    @submit="handleSubmit"
    @reset="handleReset"
  />
</template>

<script setup>
  <% d.proFormImportCode %><%# if(d.proFormVarCode){ %>

  <% d.proFormVarCode %><%# } %>

  /** 表单配置 */
  const config = ref({});

  /** 表单数据 */
  const [form, resetFields, assignFields, setFieldValue] = useFormData({});

  /** 提交表单 */
  const handleSubmit = (form) => {
    console.log(form);
  };

  /** 重置表单 */
  const handleReset = () => {<%# if(d.showFooterExpand){ %>
    resetFields(void 0, ['searchExpand']);<%# }else{ %>
    resetFields();<%# } %>
  };

  // 加载表单构建数据
  config.value = <% d.proFormConfigCode %>;

  // 赋初始值
  assignFields(getFormInitValue(config.value?.items), true);
<\/script>
`;
const formTemplate = `<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"<% d.formPropsCode %>
    @submit.prevent=""
  ><% d.formContentCode %>
  </el-form>
</template>

<script setup>
  <% d.formImportCode %>

  /** 表单组件 */
  const formRef = ref(null);

  /** 表单数据 */
  const [form, resetFields, _assignFields] = useFormData(<% d.modelCode %>);

  /** 表单验证规则 */
  const rules = reactive(<% d.formRuleCode %>);

  /** 提交表单 */
  const handleSubmit = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      console.log(form);
    });
  };

  /** 重置表单 */
  const handleReset = () => {
    resetFields();
    nextTick(() => {
      formRef.value?.clearValidate?.();
    });
  };<%# if(d.showFooterExpand){ %>

  /** 搜索表单是否展开 */
  const searchExpand = ref(false);<%# } %><%# if(d.formVarCode){ %>

  <% d.formVarCode %><%# } %>
<\/script>
`;
const contentTemplate = `<%# getFormContent(d.items,d.grid,d.rowProps,d.indentSize,d.contentExtra,d.contentExtraColProps); function getFormContent(items,grid,rowProps,indentSize,contentExtra,contentExtraColProps){ var indentChar = Array.from({length:indentSize||0}).fill(' ').join(''); if(!grid){ (items||[]).forEach(function(item){ %>
<% indentChar %><%# getFormItem(item,indentSize); }); if(contentExtra){ %>
<% indentChar %><% d.addIndentChar(contentExtra,indentChar) %><%# } }else if(items&&items.length){ %>
<% indentChar %><el-row<% d.addIndentChar(d.generatePropsCode(rowProps,null,2,true),indentChar) %>><%# items.forEach(function(item){ %>
<% indentChar %>  <el-col<% d.generateColProps(item,grid,4,indentChar) %>>
<% indentChar %>    <%# getFormItem(item,(indentSize||0)+4); %>
<% indentChar %>  </el-col><%# }); if(contentExtra){ %>
<% indentChar %>  <el-col<% d.generateColProps(null,contentExtraColProps,4,indentChar) %>>
<% indentChar %>    <% d.addIndentChar(contentExtra,'    '+indentChar) %>
<% indentChar %>  </el-col><%# } %>
<% indentChar %></el-row><%# } } function getFormItem(item,indentSize){ var indentChar = Array.from({length:indentSize||0}).fill(' ').join(''); if(item.type=='icon'){ %><el-icon<% d.generateComponentProps(item,2,indentChar,['name']) %>><%# if(item.props&&item.props.name){ %>
<% indentChar %>  <<% item.props.name %> /><%# } getFormContent(item.children,item.grid,item.rowProps,indentSize+2); %>
<% indentChar %></el-icon><%# }else if(item.type=='tabs'){ %><ele-tabs<% d.generateComponentProps(item,2,indentChar) %>><%# (item.children||[]).forEach(function(tabItem){ %>
<% indentChar %>  <template #<% tabItem.prop %>><%# getFormContent(tabItem.children,tabItem.grid,tabItem.rowProps,indentSize+4); %>
<% indentChar %>  </template><%# }); %>
<% indentChar %></ele-tabs><%# }else if(item.type=='div'){ var divTagName = d.getDivTag(item); %><<% divTagName %><% d.generateComponentProps(item,2,indentChar) %>><%# const divHTML = (item.props||{}).innerHTML||item.label; if(divHTML){ %>
<% indentChar %>  <% divHTML %><%# } getFormContent(item.children,item.grid,item.rowProps,indentSize+2); %>
<% indentChar %></<% divTagName %>><%# }else if(d.isContainerType(item)){ %><<% d.getComponentTag(item) %><% d.generateComponentProps(item,2,indentChar) %>><%# if(item.label){ %>
<% indentChar %>  <% item.label %><%# } getFormContent(item.children,item.grid,item.rowProps,indentSize+2); %>
<% indentChar %></<% d.getComponentTag(item) %>><%# }else{ %><el-form-item<% d.generateFormItemProps(item,2,indentChar) %>>
<% indentChar %>  <%# if((item.type=='select'||item.type=='multipleSelect')&&d.isArrayOptions(item)){ %><el-select<% d.generateComponentProps(item,4,indentChar,['options']) %>><%# ((item.props||{}).options||[]).forEach(function(opt){ %>
<% indentChar %>    <el-option<% d.generatePropsCode(opt,true) %> /><%# }); %>
<% indentChar %>  </el-select><%# }else if(item.type=='radio'&&d.isArrayOptions(item)){ %><el-radio-group<% d.generateComponentProps(item,4,indentChar,['options']) %>><%# ((item.props||{}).options||[]).forEach(function(opt){ %>
<% indentChar %>    <el-radio<% d.generatePropsCode(opt,true) %> /><%# }); %>
<% indentChar %>  </el-radio-group><%# }else if(item.type=='radioButton'&&d.isArrayOptions(item)){ %><el-radio-group<% d.generateComponentProps(item,4,indentChar,['options']) %>><%# ((item.props||{}).options||[]).forEach(function(opt){ %>
<% indentChar %>    <el-radio-button<% d.generatePropsCode(opt,true) %> /><%# }); %>
<% indentChar %>  </el-radio-group><%# }else if(item.type=='checkbox'&&d.isArrayOptions(item)){ %><el-checkbox-group<% d.generateComponentProps(item,4,indentChar,['options']) %>><%# ((item.props||{}).options||[]).forEach(function(opt){ %>
<% indentChar %>    <el-checkbox<% d.generatePropsCode(opt,true) %> /><%# }); %>
<% indentChar %>  </el-checkbox-group><%# }else if(item.type=='checkboxButton'&&d.isArrayOptions(item)){ %><el-checkbox-group<% d.generateComponentProps(item,4,indentChar,['options']) %>><%# ((item.props||{}).options||[]).forEach(function(opt){ %>
<% indentChar %>    <el-checkbox-button<% d.generatePropsCode(opt,true) %> /><%# }); %>
<% indentChar %>  </el-checkbox-group><%# }else if(item.type=='text'){ %><ele-text<% d.generateComponentProps(item,4,indentChar) %>>
<% indentChar %>    {{ form.<% item.prop %> }}
<% indentChar %>  </ele-text><%# }else{ %><% d.generateComponentCode(item,4,indentChar) %><%# } %>
<% indentChar %></el-form-item><%# } } %>`;
const footerTemplate = `<el-form-item<% d.footerPropsCode %>>
  <div :style="<% d.footerStyleCode %>">
    <el-button type="primary" @click="handleSubmit"><% d.submitText==null?'提交':d.submitText %></el-button>
    <el-button @click="handleReset"><% d.resetText==null?'重置':d.resetText %></el-button><%# if(d.showFooterExpand){ %>
    <el-link
      type="primary"
      underline="never"
      style="margin-left: 12px"
      @click="searchExpand = !searchExpand"
    >
      <template v-if="searchExpand">
        <span><% d.searchShrinkText==null?'收起':d.searchShrinkText %></span>
        <el-icon style="vertical-align: -1px">
          <ArrowUp />
        </el-icon>
      </template>
      <template v-else>
        <span><% d.searchExpandText==null?'展开':d.searchExpandText %></span>
        <el-icon style="vertical-align: -2px">
          <ArrowDown />
        </el-icon>
      </template>
    </el-link><%# } %>
  </div>
</el-form-item>`;
export {
  contentTemplate,
  footerTemplate,
  formTemplate,
  proTemplate
};
