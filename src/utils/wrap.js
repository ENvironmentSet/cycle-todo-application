import { curry } from 'ramda';

export default curry((key, value) => ({ [key]: value }));
