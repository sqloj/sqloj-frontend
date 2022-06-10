import { App } from 'vue';
import MarkdownIt from 'markdown-it';
let md = new MarkdownIt();
export default {
  install: (app: App) => {
    app.directive('markdown', {
      updated(el: HTMLElement) {
        el.innerHTML = md.render(el.innerHTML);
      },
      mounted(el: HTMLElement) {
        el.innerHTML = md.render(el.innerHTML);
      }
    });
  }
};
