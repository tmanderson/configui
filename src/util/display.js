export function wrapInput(inputElement) {
  const wrap = document.createElement('div');
  wrap.className = 'label-wrap';

  const label = document.createElement('label');
  label.setAttribute('for', inputElement.name);
  label.innerText = inputElement.name;
  wrap.appendChild(label);

  const value = document.createElement('span');
  value.dataset.for = inputElement.name;
  value.innerText = /check|radio/.test(inputElement.type) ? inputElement.checked : inputElement.value;

  wrap.appendChild(value);

  inputElement.parentNode.replaceChild(wrap, inputElement);
  wrap.insertBefore(inputElement, value);
}

export function createLabels(root) {
  root.querySelectorAll('[data-group]')
    .forEach(el => {
      let sp = document.createElement('h2');
      sp.innerText = el.dataset.group;
      el.insertBefore(sp, el.children[0]);
    });

  root.querySelectorAll('input').forEach(el => wrapInput(el));
}
