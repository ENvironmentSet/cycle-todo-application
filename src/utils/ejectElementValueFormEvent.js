import { compose, prop } from 'ramda';

export default compose(prop('value'), prop('target'));
