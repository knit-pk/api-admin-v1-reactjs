import md from 'markdown-it';
import mdk from '@iktakahiro/markdown-it-katex';
import hljs from 'highlightjs';

const renderer = md({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code data-lang="${lang}">${
          hljs.highlight(lang, str, true).value
        }</code></pre>`;
      } catch (__) {} // eslint-disable-line
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});
renderer.use(mdk, { throwOnError: false, errorColor: ' #cc0000' });


export default renderer;
