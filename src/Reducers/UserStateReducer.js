import { USER_STATE_CHANGED } from '../Actions/UserStateChanged';

export default (previousState = {}, { type, payload }) => {
  if (type === USER_STATE_CHANGED) {
    return payload.user;
  }
  return previousState;
};
