import {all} from 'redux-saga/effects';
import UserSagas from "./UserSagas";
import SecuritySagas from "./SecuritySagas";
import VisualAssetsSagas from "./VisualAssetsSagas";

export default function* rootSaga(): Generator {
  yield all([
    UserSagas(),
    SecuritySagas(),
    VisualAssetsSagas(),
  ]);
}
