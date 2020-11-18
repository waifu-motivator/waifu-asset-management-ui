import {all, call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {INITIALIZED_APPLICATION} from "../events/ApplicationLifecycleEvents";
import {selectVisualAssetState} from "../reducers";
import {Storage} from "aws-amplify";
import {AssetGroupKeys, S3ListObject} from "../types/AssetTypes";
import {TextAssetDefinition, TextualMotivationAsset} from "../reducers/TextAssetReducer";
import {
  createLoadedAllTextAssets,
  createReceivedTextAssetList,
  createReceivedTextS3List
} from "../events/TextAssetEvents";
import {StringDictionary} from "../types/SupportTypes";
import {downloadAsset} from "./CommonSagas";

function* loadTextAssets(allTextAssets: TextAssetDefinition[]) {
  try {
    const textAssets: StringDictionary<TextualMotivationAsset[]> = yield call(() =>
      allTextAssets.reduce((accum, textAsset) =>
          accum.then(accumTextAssets =>
            downloadAsset<TextualMotivationAsset[]>(`${AssetGroupKeys.TEXT}/${textAsset.path}`)
              .then((textAssets: TextualMotivationAsset[]) => ({
                ...accumTextAssets,
                [textAsset.categories[0]]: textAssets,
              }))
          ),
        Promise.resolve<StringDictionary<TextualMotivationAsset[]>>({})),
    );
    yield put(createLoadedAllTextAssets(textAssets));
  } catch (e) {
    console.warn("Unable to load text assets", e)
  }
}

function* textAssetFetchSaga() {
  const {s3List} = yield select(selectVisualAssetState)
  if (s3List.legth) return;

  yield fork(assetJsonSaga);

  try {
    const allTextAssets: S3ListObject[] = yield call(() =>
      Storage.list(`${AssetGroupKeys.TEXT}/`)
        .then((result: S3ListObject[]) => result.filter(ob =>
          !(ob.key.endsWith("checksum.txt") || ob.key.endsWith("assets.json"))
        ))
    );
    yield put(createReceivedTextS3List(allTextAssets.map(s3Asset => ({
      ...s3Asset,
      eTag: s3Asset.eTag.replaceAll('"', '')
    }))));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* assetJsonSaga() {
  try {
    const assetJson: TextAssetDefinition[] = yield call(() =>
      downloadAsset(`${AssetGroupKeys.TEXT}/assets.json`)
    );
    yield fork(loadTextAssets, assetJson);
    yield put(createReceivedTextAssetList(assetJson));
  } catch (e) {
    console.warn("Unable to get user profile information", e)
  }
}

function* textAssetSagas() {
  yield takeEvery(INITIALIZED_APPLICATION, textAssetFetchSaga);
}

export default function* (): Generator {
  yield all([textAssetSagas()]);
}
