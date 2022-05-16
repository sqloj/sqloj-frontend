<template>
  <div class="editor" ref="dom"></div>
</template>

<script setup>
import { onMounted, defineProps, defineEmit, ref } from 'vue';
import * as monaco from 'monaco-editor';

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};

const props = defineProps({
  modelValue: String,
});

const emit = defineEmit(['update:modelValue']);

const dom = ref();

let instance;

onMounted(() => {
  const jsonModel = monaco.editor.createModel(props.modelValue, 'json');

  instance = monaco.editor.create(dom.value, {
    model: jsonModel,
    tabSize: 2,
    automaticLayout: true,
    scrollBeyondLastLine: false,
  });

  instance.onDidChangeModelContent(() => {
    const value = instance.getValue();
    emit('update:modelValue', value);
  });
});
</script>

<style scoped>
.editor {
  height: 100%;
}
</style>
