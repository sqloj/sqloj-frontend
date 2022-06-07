import 'katex/dist/katex.css';
import renderMathInElement from 'katex/contrib/auto-render';
import { App } from 'vue';

const renderOption = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true }
  ],
  throwOnError: false
};

export default {
  install: (app: App) => {
    app.directive('katex', {
      updated(el: HTMLElement) {
        renderMathInElement(el, renderOption);
      },
      mounted(el: HTMLElement) {
        renderMathInElement(el, renderOption);
      }
    });
  }
};
