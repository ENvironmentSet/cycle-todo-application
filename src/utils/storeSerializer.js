import { replace, pipe, mapObjIndexed, ifElse, is, identity, compose, equals, flip, constructN, nAry } from 'ramda';

export const storeSerializer = pipe(
  mapObjIndexed(ifElse(is(RegExp), compose(replace(/\//g, ''), String), identity)),
  JSON.stringify,
);

export const storeDeserializer = pipe(
  nAry(1, JSON.parse),
  mapObjIndexed(ifElse(flip(equals('todoFilter')), constructN(1, RegExp), identity)),
);
