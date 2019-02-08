export function storeSerializer(store) {
  const serializableStore = {...store, todoFilter: store.todoFilter.toString().replace(/\//g, '') };

  return JSON.stringify(serializableStore);
}

export function storeDeserializer(store) {
  const partialSerializedStore = JSON.parse(store);

  return {...partialSerializedStore, todoFilter: new RegExp(partialSerializedStore.todoFilter) };
}
