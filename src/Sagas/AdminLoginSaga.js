import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'admin-on-rest';

function* adminLoggedIn() {
  yield put(showNotification('Admin logged in successfully!'));
}

export default function* adminLoginSaga() {
  yield takeEvery('AOR/USER_LOGIN_SUCCESS', adminLoggedIn);
}
