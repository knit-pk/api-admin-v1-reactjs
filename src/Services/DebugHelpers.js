import util from 'util';

const deepInspect = (obj, options) => (util.inspect(obj, Object.assign({
  showHidden: false,
  depth: null,
}, options)));

export const deepConsoleLog = (obj, options) => console.log(deepInspect(obj, options));

export const deepConsoleLogNoHidden = (obj, depth = 2) => deepConsoleLog(obj, { showHidden: true, depth });
