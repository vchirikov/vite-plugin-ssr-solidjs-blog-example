function jsx(node, props) {
  if (node === jsx) node = document.createDocumentFragment();
  // check [svelte-jsx/jsx-runtime.js at main · kenoxa/svelte-jsx](https://github.com/kenoxa/svelte-jsx/blob/main/src/jsx-runtime.js)
  // is ctor
  else if (typeof node === 'function' && !!node.prototype && !!node.prototype.constructor.name) {
    const target = document.createElement('div');
    const component =  new node({target, hydrate: true, props });
    return target;
  }
  else if (typeof node === 'function') return node(props);
  else node = document.createElement(node);

  for (const name in props) {
    if (name !== 'children') node.setAttribute(name, props[name]);
    else Array.isArray(props.children)
      ? node.append(...props.children)
      : node.append(props.children);
  }

  return node;
}

export { jsx, jsx as jsxDEV, jsx as jsxs, jsx as Fragment };