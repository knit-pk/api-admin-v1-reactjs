import { put, takeEvery, select } from 'redux-saga/effects';
import { showNotification } from 'react-admin';
import { USER_LOGIN_SUCCESS } from 'ra-core';
import { hydraRefreshMetadata } from '../Actions/HydraActions';

const isFirstVisitOfUser = state => state.user.firstVisit;


function* onAdminLoggedIn() {
  const firstVisit = yield select(isFirstVisitOfUser);
  if (firstVisit) {
    yield put(showNotification('Login was successful. Page will now reload, to refresh api metadata.'));
    yield put(hydraRefreshMetadata(1000));
  } else {
    yield put(showNotification('Logged in successfully.'));
  }
}

export default function* adminLoginSaga() {
  yield takeEvery(USER_LOGIN_SUCCESS, onAdminLoggedIn);
}
