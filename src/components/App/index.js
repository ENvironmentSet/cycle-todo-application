import xs from 'xstream';
import { partial, prop } from 'ramda';
import { createUpdate } from '^/drivers';

import { route, initAction } from '^/constants';

export default function App({ DOM, state$, router }) {
  const pageSinks$ = router.routedComponent(route)({ DOM, state$, router });

  return {
    DOM: pageSinks$.map(prop('DOM')).flatten(),
    router: xs.merge(pageSinks$.map(prop('router')).flatten(), xs.of('/')),
    storage$: state$.map(partial(createUpdate, ['persisted_state'])),
    action$: xs.merge(pageSinks$.map(prop('action$')).flatten(), xs.of(initAction)),
  }
}
