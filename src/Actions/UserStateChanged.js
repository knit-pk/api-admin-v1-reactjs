export const USER_STATE_CHANGED = 'USER_STATE_CHANGED';
export const userStateChanged = user => ({
  type: USER_STATE_CHANGED,
  payload: { user },
});
