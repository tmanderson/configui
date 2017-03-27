function getSelector(name, group=false) {
  // Any dot-delimeted name assumes inputs in preceeding groups.
  // e.g. `something.else.a` => `[data-group="something"] [data-group="else"] input[name="a"]
  return name.split('.').reduce((selector, name, i, names) => {
    if(group || i < names.length-1) return selector + ' [data-group="' + name + '"]';
    return selector + ' input[name="' + name + '"]';
  }, '');
}

function getValue(el) {
  let value = /^(checkbox|radio)/i.test(el.type) ? el.checked : parseFloat(el.value);
  if(!value && typeof value === 'number' && value !== 0) return el.value;
  return !value && value !== false ? e.target.value : value;
}

export class ConfiGUI {
  get groups() { return Array.from(this.root.querySelectorAll('[data-group]')); }
  get inputs() { return Array.from(this.root.querySelectorAll('input:not([data-group-item])')); }

  constructor(el) {
    this.root = el || document.body.querySelector('[data-configui]:not([data-active="true"])');
    if(this.root) this.root.dataset.active = true;

    Array.from(this.root.querySelectorAll('input'))
      .forEach(el => {
        if(el.parentNode.dataset.group) {
          el.dataset.groupItem = el.parentNode.dataset.group;
        }
      });

    this.updateLabels();

    this.on((v, e) => {
      const value = v[e.target.name] || this.get(e.target.name);

      if(typeof value === 'object') {
        this.updateLabel(value);
      }
      else {
        this.updateLabel({ [e.target.name]: value });
      }
    });
  }

  updateLabels() {
    this.inputs.forEach(el => this.updateLabel({ [el.name]: this.get(el.name) }));

    this.groups.forEach(el => {
      let sp = document.createElement('span');
      sp.innerText = el.dataset.group;
      el.insertBefore(sp, el.children[0]);
      this.updateLabel(this.get(el.dataset.group))
    });
  }

  updateLabel(values, e) {
    if(e && e.target.dataset.noLabel) return;
    let el, label, wrap, parent;

    Object.keys(values)
      .forEach(key => {
        el = this.root.querySelector(`input[name="${key}"]`);
        label = this.root.querySelector(`[data-for="${key}"]`);

        if(!label) {
          wrap = document.createElement('div');
          wrap.className = 'label-wrap';
          label = document.createElement('label');
          label.dataset.for = el.name;

          if(el.nextSibling) {
            el.parentNode.insertBefore(label, el.nextSibling);
          }
          else {
            el.parentNode.appendChild(label);
          }

          el.parentNode.replaceChild(wrap, el);
          wrap.appendChild(el);
          wrap.appendChild(label);
        }

        label.innerText = values[key];
      });
  }

  get(name) {
    if(!name) {
      return Object.assign({},
        this.inputs.reduce((values, el) => Object.assign(values, { [el.name]: el.value }), {}),
        this.groups.reduce((values, el) => Object.assign(values, {
          [el.dataset.group]: this.get(el.dataset.group)
        }), {})
      );
    }

    const el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));

    // if `name` references a group, return an object with all of its values
    if(el && el.tagName !== 'INPUT') {
      return Array.from(el.querySelectorAll('input'))
        .reduce((group, el) => Object.assign(group, { [el.name]: getValue(el) } ), {});
    }
    else {
      return getValue(el);
    }
  }

  set(name, value) {
    const el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));

    if(el && el.tagName !== 'INPUT') {
      return Array.from(el.querySelectorAll('input'))
        .forEach(el => (el.value = (value[el.name] || value)));
    }
    else {
      el.value = value;
    }
  }

  on(name, callback) {
    let cb, el;

    if(typeof name === 'function') {
      callback = name;
      name = undefined;
      el = this.root;
    }
    else {
      el = this.root.querySelector(getSelector(name)) || this.root.querySelector(getSelector(name, true));
    }

    if(!el) throw new Error('The selector must map to an input...');

    cb = e => callback.call(null, this.get(name), e);

    el.addEventListener('input', cb, el.tagName !== 'INPUT');
    el.addEventListener('change', cb, el.tagName !== 'INPUT');

    return this.off.bind(this, el, cb);
  }

  off(el, callback) {
    el.removeEventListener('input', callback, el.tagName !== 'INPUT');
    el.removeEventListener('change', callback, el.tagName !== 'INPUT');
  }
}
