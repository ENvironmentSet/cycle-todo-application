import { run } from '@cycle/run';

import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver } from '@cycle/history';
import { makeStorageDriver } from '^/drivers';
import { actionDriver, stateDriver } from '^/store';

import { routerify } from 'cyclic-router';
import switchPath from 'switch-path';

import { storeSerializer } from '^/utils';

import App from '^/components';

const main = routerify(App, switchPath);

const drivers = {
  DOM: makeDOMDriver('#app'),
  history: makeHistoryDriver(),
  storage$: makeStorageDriver(localStorage, storeSerializer),
  action$: actionDriver,
  state$: stateDriver,
};

run(main, drivers);
