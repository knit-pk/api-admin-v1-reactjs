import markdownIt from 'markdown-it';
import markdownItKatex from '@iktakahiro/markdown-it-katex';

const renderer = markdownIt();
renderer.use(markdownItKatex, { throwOnError: false, errorColor: ' #cc0000' });


export default renderer;
