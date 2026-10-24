/* One vector arrow system for static pages, interactive content and exports. */
window.SaliniIcons = (() => {
  const paths = {
    '↗':'M5 19 19 5M5 5h14v14',
    '↖':'M19 19 5 5M5 19V5h14',
    '↘':'M5 5 19 19M5 19h14V5',
    '↙':'M19 5 5 19M5 5v14h14',
    '→':'M4 12h16m-7-7 7 7-7 7',
    '←':'M20 12H4m7-7-7 7 7 7',
    '↑':'M12 20V4m-7 7 7-7 7 7',
    '↓':'M12 4v16m-7-7 7 7 7-7',
    '↺':'M5 8a8 8 0 1 1-1 8M5 3v5h5',
    '▷':'m8 5 11 7-11 7Z',
    '▶':'m8 5 11 7-11 7Z',
  };
  const arrows = /[↗↖↘↙→←↑↓↺▷▶][\uFE0E\uFE0F]?/g;
  const ignored = 'script,style,textarea,pre,code,option,svg,math,[contenteditable]';
  function arrow(value) {
    const path = paths[value[0]];
    if (!path) return value;
    return `<svg class="salini-arrow" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="display:inline-block;vertical-align:-.14em;flex-shrink:0"><path d="${path}"/></svg>`;
  }
  function html(markup) {
    // Preserve attributes, raw-text elements and comments. Convert visible text only.
    const tokens = /<!--[\s\S]*?-->|<(script|style|textarea|pre|code|option|svg|math)\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/\1\s*>|<(?:[^>"']|"[^"]*"|'[^']*')*>|[^<]+/gi;
    return String(markup).replace(tokens, token => token.startsWith('<') ? token : token.replace(arrows, arrow));
  }
  function replaceText(node) {
    if (!node.parentElement || node.parentElement.closest(ignored) || !node.data.match(arrows)) return;
    const fragment = document.createDocumentFragment();
    let end = 0;
    for (const match of node.data.matchAll(arrows)) {
      fragment.append(document.createTextNode(node.data.slice(end, match.index)));
      const template = document.createElement('template');
      template.innerHTML = arrow(match[0]);
      fragment.append(template.content);
      end = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(node.data.slice(end)));
    node.replaceWith(fragment);
  }
  function enhance(root) {
    if (root.nodeType === 3) { replaceText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1 && root.closest(ignored)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceText);
  }
  let observer;
  function mount() {
    if (observer) return;
    enhance(document.body);
    observer = new MutationObserver(records => {
      const roots = new Set();
      records.forEach(record => record.type === 'characterData' ? roots.add(record.target) : record.addedNodes.forEach(node => roots.add(node)));
      roots.forEach(root => { if (root.isConnected) enhance(root); });
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true});
  }
  return {arrow, html, enhance, mount};
})();
