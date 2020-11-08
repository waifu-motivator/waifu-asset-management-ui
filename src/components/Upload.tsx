import React, {FC, useCallback, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone'
import {Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import WaifuDisplay from "./WaifuDisplay";

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

interface WaifuAsset {
  btoa: string;
  file: File;
}

const Upload: FC = () => {

  const [waifuToUpload, setWaifuToUpload] = useState<WaifuAsset[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.reduce((accum, next) => accum.then((others) =>
      new Promise<WaifuAsset[]>(resolve => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          const binaryStr = _arrayBufferToBase64(reader.result as ArrayBuffer)
          resolve([
            ...others,
            {
              file: next,
              btoa: `data:image/${next.name.substr(next.name.lastIndexOf('.') + 1)};base64,${binaryStr}`,
            }
          ])
        }
        reader.readAsArrayBuffer(next)
      })), Promise.resolve<WaifuAsset[]>([]))
      .then(droppedFiles => {
        setWaifuToUpload(prevState => [
          ...prevState,
          ...droppedFiles,
        ])
      })

  }, [])
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

  return (
    <section className="container">
      {/*// @ts-ignore*/}
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag/drop some waifu here, or click to select waifu</p>
      </div>
      <aside>
        <h4>Waifu to Upload</h4>
        <Grid container spacing={3}>

          {
            waifuToUpload.map(file => (
              <Grid item key={file.file.name}>
                <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/assets/upload/${file.file.name}`}>
                  <WaifuDisplay href={file.btoa}/>
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
