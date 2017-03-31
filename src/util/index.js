export { valueOf, closest, parents } from './dom';
export { createLabels } from './display';

export function get(obj, ns) {
  return ns.split('.').reduce((obj, key) => obj[key], obj);
}

export function set(obj, key, value) {
  key.split('.')
    .reduce((obj, k, i, ns) => {
      if(i < ns.length-1) {
        return (obj[k] = obj[k] || {});
      }
      else {
        return Object.assign(obj, { [k]: value });
      }
    }, obj);

  return obj;
}
