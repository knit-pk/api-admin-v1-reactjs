import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'admin-on-rest';

export default function* adminLoginSaga() {
  yield takeEvery('AOR/USER_LOGIN_SUCCESS', function* () {
    yield put(showNotification('Admin logged in successfully!'));
  });
}
