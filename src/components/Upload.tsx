import React, {FC, useCallback, useMemo} from 'react';
import {useDropzone} from 'react-dropzone'
import {Grid, TextField} from "@material-ui/core";
import {Link} from "react-router-dom";
import WaifuDisplay from "./WaifuDisplay";
import md5 from 'js-md5';
import {useDispatch, useSelector} from "react-redux";
import {droppedWaifu} from "../events/VisualAssetEvents";
import {selectMotivationAssetState} from "../reducers";
import {LocalMotivationAsset} from "../reducers/MotivationAssetReducer";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: 'var(--info-color)',
  borderStyle: 'dashed',
  backgroundColor: 'var(--code-block-color)',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const _arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const readFile = (next: File): Promise<{ binaryStr: string; result: ArrayBuffer }> =>
  new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as ArrayBuffer;
      const binaryStr = _arrayBufferToBase64(result)
      resolve({binaryStr, result})
    }
    reader.readAsArrayBuffer(next)
  });

export function getFileType(next: File) {
  return next.name.substr(next.name.lastIndexOf('.') + 1);
}

const Upload: FC = () => {
  const dispatch = useDispatch();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.reduce((accum, next) => accum.then((others) =>
      readFile(next).then(({
                             binaryStr, result
                           }) => {
        return ([
          ...others,
          {
            file: next,
            checkSum: md5(result),
            btoa: `data:image/${(getFileType(next))};base64,${binaryStr}`,
          }
        ])
      })), Promise.resolve<LocalMotivationAsset[]>([]))
      .then(readWaifu => {
        dispatch(droppedWaifu(readWaifu));
      });
  }, [dispatch])
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({onDrop, accept: 'image/*'});

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const {motivationAssetsToUpload} = useSelector(selectMotivationAssetState);

  return (
    <section className="container">
      {/*// @ts-ignore*/}
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag/drop some waifu here, or click to select waifu</p>
      </div>
      <TextField name='Asset Directory'
                 placeholder={"surprised/"}
                 label="Destination directory"
                 variant={"outlined"}
      />
      <aside>
        <Grid container spacing={3}>
          {
            motivationAssetsToUpload.map(motivationAssetToUpload => (
              <Grid item key={motivationAssetToUpload.file.name}>
                <Link style={{textDecoration: 'none', color: 'inherit'}}
                      to={`/assets/view/upload/${motivationAssetToUpload.checkSum}`}>
                  <WaifuDisplay href={motivationAssetToUpload.btoa}/>
                </Link>
              </Grid>
            ))
          }
        </Grid>
      </aside>
    </section>
  )
};

export default Upload;
