<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  value: string;
}>();

let instance: monaco.editor.IStandaloneCodeEditor;
const editContainer = ref();

const emit = defineEmits(['update:value']);

onMounted(() => {
  instance = monaco.editor.create(editContainer.value, {
    value: props.value,
    language: 'sql'
  });
  instance.onDidChangeModelContent(() => {
    emit('update:value', instance.getValue());
  });
});
</script>

<template>
  <div class="editor-wrapper">
    <div ref="editContainer" class="code-editor"></div>
  </div>
</template>

<style scoped>
.code-editor {
  min-height: 300px;
  /* box-shadow: 0 0 0 1px gray; */
  /* border-radius:3px; */
}

.editor-wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid rgb(224, 224, 230);
}
</style>
