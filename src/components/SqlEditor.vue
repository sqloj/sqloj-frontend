<script lang="ts" setup>
import * as monaco from 'monaco-editor';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  value: string;
  valueChange?: boolean;
}>();

let instance: monaco.editor.IStandaloneCodeEditor;
const editContainer = ref();

const emit = defineEmits(['update:value']);
watch(
  () => props.valueChange,
  () => {
    instance.setValue(props.value);
  }
);
onMounted(() => {
  instance = monaco.editor.create(editContainer.value, {
    value: props.value,
    language: 'sql'
    // readOnly: props.readonly
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
  min-height: 250px;
  /* box-shadow: 0 0 0 1px gray; */
  /* border-radius:3px; */
}

.editor-wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid rgb(224, 224, 230);
  transition: border 0.5s, box-shadow 0.5s;
}

.editor-wrapper:hover {
  border: 1px solid #36ad6a;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}
</style>
