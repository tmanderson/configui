import { set } from './index'

export function closest(el, selector) {
  let target = el;

  while(target && target.parentNode && !target.matches(selector)) {
    target = target.parentNode;
  }

  return target;
}

export function parents(el, selector) {
  const parents = [];
  let target = el;

  while(target && target.parentNode) {
    if(!selector || selector && target.matches(selector)) {
      parents.push(target);
    }

    target = target.parentNode;
  }

  return parents;
}

export function valueOf(el) {
  if(el.tagName !== 'INPUT') {
    return (Array.from(el.querySelectorAll('input')) || [])
      .reduce((values, el) => set(values, el.dataset.ns, valueOf(el)), {});
  }
  else if(el.type === 'checkbox' || el.type === 'radio') {
    return !!el.checked;
  }
  else {
    return parseFloat(el.value) || el.value;
  }
}
