import { closest, valueOf, parents, get, set, createLabels } from './util';

function handleInput(e) {
  const name = e.target.dataset.ns;
  const val = valueOf(e.target);
  const model = set(this.model, name, val);

  e.target.nextElementSibling.innerText = val;

  if(this.listeners[name]) {
    this.listeners[name].forEach(fn => fn.call(null, val, this.model, e));
  }

  this.listeners['*'].forEach(fn => fn.call(null, model, e));
}

export default class ConfiGUI {
  get inputs() { return Array.from(this.root.querySelectorAll('input')); }

  constructor(el) {
    this.root = el || document.querySelector('[data-configui]:not([data-active])');
    if(!this.root) throw new Error('No [data-configui] element found and none provided to constructor');

    this.listeners = { '*': [] };

    this.inputs.forEach(input => {
      const group = parents(input, '[data-group]');
      const ns = group.map(el => el.dataset.group).concat(input.name).join('.');

      input.dataset.ns = ns;
    });

    this.model = valueOf(this.root);
    createLabels(this.root);

    this.root.addEventListener('input', handleInput.bind(this), true);
    this.root.addEventListener('change', handleInput.bind(this), true);
  }

  set(name, value) {
    if(typeof value === 'object') {
      return Object.keys(value)
        .map(key => this.set([name, key].join('.'), value[key]));
    }

    const target = this.root.querySelector(`[data-ns="${name}"]`);

    if(/check|radio/.test(target.type)) {
      target.checked = !!value;
    }
    else {
      target.value = value;
    }

    handleInput.call(this, { target, type: 'custom' });
  }

  get(name) {
    return get(this.model, name);
  }

  on(name, callback) {
    if(typeof name === 'function') {
      callback = name;
      name = '*';
    }

    this.listeners[name] = [].concat(this.listeners[name] || []).concat(callback);
    const i = this.listeners[name].length - 1;
    return () => this.listeners[name].splice(i, 1);
  }

  off(name, fn) {
    this.listeners[name].splice(this.listeners[name].findIndex(fn), 1);
  }
}
