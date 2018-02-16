import { put, takeEvery } from 'redux-saga/effects';
import { showNotification } from 'admin-on-rest';
import { havingItem, removeItems } from '../Storage/LocalStorage';

function* adminLoggedIn() {
  havingItem('should_reload', () => {
    removeItems('should_reload', 'hydra_api');
    window.location.reload();
  });
  yield put(showNotification('Admin logged in successfully!'));
}

export default function* adminLoginSaga() {
  yield takeEvery('AOR/USER_LOGIN_SUCCESS', adminLoggedIn);
}