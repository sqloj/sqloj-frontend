import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { App } from 'vue';

export default {
  install: (app: App) => {
    app.directive('highlight', {
      updated(el: HTMLElement) {
        el.querySelectorAll('pre code').forEach((e: any) => {
          hljs.highlightElement(e);
        });
      },
      mounted(el: HTMLElement) {
        el.querySelectorAll('pre code').forEach((e: any) => {
          hljs.highlightElement(e);
        });
      }
    });
  }
};
