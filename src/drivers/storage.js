import xs from 'xstream';

const defaultStorage = localStorage || Object.freeze({
  length: 0,
  clear() {},
  getItem() { return null; },
  key() { return null; },
  removeItem() {},
  setItem() {},
});

function defaultSerializer(value) {
  if (value == null) {
    return '';
  }
  else if (typeof value.toString === 'function') {
    return value.toString();
  } else {
    return String(value);
  }
}

export function createUpdate(key, value) {
  return { key, value };
}

export default function makeStorageDriver(storage = defaultStorage, serializer = defaultSerializer) {
  return function storageDriver(data$) {
    const storageMap = Object.freeze(new Map());
    const storageMap$ = xs.createWithMemory();
    data$.addListener({
      next({ key, value }) {
        const serialized = serializer(value);

        storageMap.set(key, serialized);
        storage.setItem(key, serialized);
        storageMap$.shamefullySendNext(storageMap);
      }
    });

    return storageMap$;
  }
};
