import xs from 'xstream';

export default function createCycleMiddleware() {
  const store$ = xs.createWithMemory();
  const action$ = xs.createWithMemory();
  const state$ = xs.createWithMemory();
  const cycleMiddleware = store => {
    store$.shamefullySendNext(store);
    return next => action => {
      next(action);
      action$.shamefullySendNext(action);
      state$.shamefullySendNext(store.getState());
    };
  };
  const actionDriver = incomingAction$ => {
    store$.addListener({
      next(store) {
        incomingAction$.addListener({
          next(action) {
            store.dispatch(action);
          }
        })
      }
    });

    return action$;
  };
  const stateDriver = () => state$;

  return Object.assign(cycleMiddleware, { actionDriver, stateDriver });
}
