import md from 'markdown-it';
import mdk from '@iktakahiro/markdown-it-katex';
import hljs from 'highlightjs';

function wrapHTML(lang, html) {
  return `<pre class="hljs"><code data-lang="${lang}">${html}</code></pre>`;
}

const renderer = md({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return wrapHTML(lang, hljs.highlight(lang, str, true).value);
      } catch (__) {} // eslint-disable-line
    }

    return wrapHTML('none', renderer.utils.escapeHtml(str));
  },
});

renderer.use(mdk, { throwOnError: false, errorColor: ' #cc0000' });


export default renderer;
