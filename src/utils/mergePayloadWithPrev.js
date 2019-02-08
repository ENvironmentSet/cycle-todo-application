import wrap from '^/utils/wrap';
import { apply, compose, pipe, flip, has, identity, ifElse, map, mergeLeft, prop } from 'ramda';

export default propName => pipe(
  Array,
  map(ifElse(has('type'), compose(wrap(propName), prop('payload')), identity)),
  apply(flip(mergeLeft)),
);
