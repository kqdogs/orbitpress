<script setup lang="ts">
import {t} from '../../../lib/i18n/client';
import { computed, nextTick, ref } from "vue";
import { videoDirective, type VideoProvider } from "../video";
const props = defineProps<{ modelValue: string; disabled?: boolean }>();
const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const input = ref<HTMLTextAreaElement>(),
  dialog = ref(false),
  provider = ref<VideoProvider>("youtube"),
  url = ref(""),
  error = ref("");
const dialogTitle = computed(
  () =>
    t("插入 ") + (provider.value === "youtube" ? "YouTube" : t("哔哩哔哩")) + t(" 视频"),
);
const videoPlaceholder = computed(() =>
  provider.value === "youtube"
    ? "https://www.youtube.com/watch?v=…"
    : "https://www.bilibili.com/video/BV…",
);
const lines = computed(() => props.modelValue.split("\n").length);
const codeOpen=ref(false),codeLanguage=ref('text');
const languages=['text','javascript','typescript','tsx','jsx','html','css','scss','vue','astro','json','yaml','toml','markdown','bash','powershell','python','go','rust','java','kotlin','swift','c','cpp','csharp','php','ruby','sql','dockerfile','nginx','lua','r','dart','xml'];
function insert(before: string, after = "") {
  const element = input.value,
    start = element?.selectionStart ?? props.modelValue.length,
    end = element?.selectionEnd ?? start;
  const selected = props.modelValue.slice(start, end);
  emit(
    "update:modelValue",
    props.modelValue.slice(0, start) +
      before +
      selected +
      after +
      props.modelValue.slice(end),
  );
  void nextTick(() => {
    element?.focus();
    element?.setSelectionRange(
      start + before.length,
      start + before.length + selected.length,
    );
  });
}
function video(value: VideoProvider) {
  provider.value = value;
  url.value = "";
  error.value = "";
  dialog.value = true;
}
function addVideo() {
  try {
    insert(`\n\n${videoDirective(provider.value, url.value)}\n\n`);
    dialog.value = false;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t("视频地址无效");
  }
}
function codeBlock() {
  const language=codeLanguage.value.trim().replace(/[\s`<>"']/g,'').slice(0,80)||'text';
  insert(`\n\`\`\`${language}\n`, "\n```\n");codeOpen.value=false;
}
function tab(event: KeyboardEvent) {
  if (event.key === "Tab") {
    event.preventDefault();
    insert("  ");
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    event.preventDefault();
    insert("**", "**");
  }
}
defineExpose({ insert });
</script>
<template>
  <div class="markdown-studio" :class="{ disabled }">
    <div class="markdown-tools">
      <el-button-group>
        <el-button :disabled="disabled" :title="t('标题')" @click="insert('\n## ')">
          H₂
        </el-button>
        <el-button
          :disabled="disabled"
          :title="t('加粗 Ctrl+B')"
          @click="insert('**', '**')"
        >
          <b>B</b>
        </el-button>
        <el-button :disabled="disabled" :title="t('斜体')" @click="insert('*', '*')">
          <i>I</i>
        </el-button>
        <el-button :disabled="disabled" :title="t('引用')" @click="insert('\n> ')">
          ❞
        </el-button>
        <el-button :disabled="disabled" :title="t('列表')" @click="insert('\n- ')"> {{ t("列表") }} </el-button>
        <el-button :disabled="disabled" :title="t('代码块')" @click="codeOpen=true"> {{ t("代码") }} </el-button>
        <el-button
          :disabled="disabled"
          :title="t('链接')"
          @click="insert(t('[链接文字]('), ')')"
        > {{ t("链接") }} </el-button>
        <el-button
          :disabled="disabled"
          :title="t('图片')"
          @click="insert(t('![图片说明](/media/'), ')')"
        > {{ t("图片") }} </el-button>
      </el-button-group>
      <el-button :disabled="disabled" @click="video('youtube')">
        YouTube
      </el-button>
      <el-button :disabled="disabled" @click="video('bilibili')"> {{ t("哔哩哔哩") }} </el-button>
    </div>
    <div class="markdown-input-wrap">
      <div class="markdown-gutter" aria-hidden="true">
        {{
          Array.from(
            { length: Math.max(lines, 20) },
            (_, index) => index + 1,
          ).join("\n")
        }}
      </div>
      <textarea
        ref="input"
        :value="modelValue"
        :disabled="disabled"
        :aria-label="t('Markdown 正文')"
        spellcheck="false"
        maxlength="100000"
        :placeholder="t('写下你的内容…\n\n支持 Markdown、图片、表格、代码，以及多个视频。')"
        @input="
          emit(
            'update:modelValue',
            ($event.target as HTMLTextAreaElement).value,
          )
        "
        @keydown="tab"
      />
    </div>
    <div class="markdown-status">
      <span>Markdown · {{ modelValue.length.toLocaleString() }} {{ t("字符") }} </span>
      <span> {{ t("Ctrl + B 加粗 · 视频可重复插入") }} </span>
    </div>
  </div>
  <el-dialog v-model="dialog" :title="dialogTitle" width="520" append-to-body>
    <el-form label-position="top" @submit.prevent="addVideo">
      <el-form-item :label="t('视频链接或 ID')">
        <el-input
          v-model="url"
          autofocus
          :placeholder="videoPlaceholder"
          :aria-label="t('视频链接或 ID')"
        />
      </el-form-item>
      <el-alert v-if="error" :title="error" type="error" :closable="false" />
      <p class="muted"> {{ t("插入当前位置；可以继续插入多个视频。哔哩哔哩支持 ?p=2 分 P 地址。") }} </p>
    </el-form>
    <template #footer>
      <el-button @click="dialog = false"> {{ t("取消") }} </el-button>
      <el-button type="primary" :disabled="!url.trim()" @click="addVideo"> {{ t("插入视频") }} </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="codeOpen" :title="t('插入代码块')" width="420" append-to-body>
   <el-form label-position="top" @submit.prevent="codeBlock"><el-form-item :label="t('代码语言')"><el-select v-model="codeLanguage" filterable allow-create default-first-option class="full-width" :aria-label="t('代码块语言')"><el-option v-for="language in languages" :key="language" :label="language" :value="language"/></el-select></el-form-item><p class="field-help"> {{ t("可输入任意语言名称，保留代码缩进和换行，前台支持一键复制。") }} </p></el-form>
   <template #footer><el-button @click="codeOpen=false"> {{ t("取消") }} </el-button><el-button type="primary" @click="codeBlock"> {{ t("插入代码") }} </el-button></template>
  </el-dialog>
</template>
