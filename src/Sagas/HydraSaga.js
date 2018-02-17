import { delay } from 'redux-saga';
import { all, call, takeLatest } from 'redux-saga/effects';
import { HYDRA_REFRESH_METADATA } from '../Actions/HydraActions';
import { removeHydraDocs } from '../Storage/HydraDocs';

function* onRefreshHydraMetadata(action) {
  yield all([call(removeHydraDocs), call(delay, action.delay)]);
  yield call([window.location, window.location.reload]);
}

export default function* hydraSaga() {
  yield takeLatest(HYDRA_REFRESH_METADATA, onRefreshHydraMetadata);
}
