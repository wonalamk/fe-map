import React, { CSSProperties, useCallback, useEffect, useMemo,  useState } from 'react';
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import "./styles.scss";

interface FileUploaderProps {
  file?: File;
  onFileUploaded: (file: File) => void;
}

enum ERROR_TYPES {
  wrongExtension = 'wrongExtension',
}

interface Error {
  errorContent: {
    code: string;
    message: string;
  },
  errorJSX: JSX.Element
}

interface ErrorMapping {
  [key: string]: Error;
}

const ALLOWED_TILE_EXTENSIONS = ['csv', 'xlsx', 'xls'];

const errorMappings: ErrorMapping = {
  wrongExtension: {
    errorContent: {
      code: "wrong-extension",
      message: "Wrong file extension"
    },
    errorJSX: (<div>Wrong file extension. Following file extensions are accepted: <b>{ALLOWED_TILE_EXTENSIONS.join(', ')}</b></div>)
  },
  badFileContent: {
    errorContent: {
      code: "bad-content",
      message: "Bad file content"
    },
    errorJSX: (<div>Your file has corrupted rows, select another file</div>)
  }
}

const FileUploader: React.FC<FileUploaderProps> = (props) => {
  const [file, setFile] = useState<File | undefined>(props.file ?? undefined);
  const [isFileRejected, setIsFileRejected] = useState<boolean>();
  const [isFileAccepted, setIsFileAccepted] = useState<boolean>();
  const [error, setError] = useState<JSX.Element>(<></>);
  const onFileUploaded = props.onFileUploaded
  const fileFromParent = props.file;


  useEffect(() => {
    if (fileFromParent) {
      setFile(fileFromParent);
    }
  }, [fileFromParent])

  const onDrop = useCallback(droppedFile => {
    if (droppedFile[0]) {
      setFile(droppedFile[0])
      onFileUploaded(droppedFile[0]);
    }
  },[onFileUploaded]);

  
  const fileValidator = (file: File) => {
    const ext = file.name.split('.').pop();
    let errorType = "";
    setFile(undefined);

    if (ext && !ALLOWED_TILE_EXTENSIONS.includes(ext)) {
      errorType = ERROR_TYPES.wrongExtension;
    };
    
    if (errorType.length !== 0) {
      setIsFileAccepted(false);
      setIsFileRejected(true);
      setError(errorMappings[errorType].errorJSX)
      return errorMappings[errorType].errorContent;
    } else {
      setIsFileAccepted(true);
      setIsFileRejected(false);
      return null;
    }
  }

  const dropzoneOptions: DropzoneOptions  = {
    onDrop,
    maxFiles: 1,
    validator: fileValidator
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone(dropzoneOptions);

  const style: CSSProperties = useMemo(() => {
    const baseStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 2,
      borderRadius: 2,
      borderColor: '#c8d9e4',
      borderStyle: 'dashed',
      backgroundColor: '#f2f2f2',
      color: '#2b6777',
      outline: 'none',
      transition: 'border .2s ease-in-out',
      height: '15em'
    };
    
    const activeStyle = {
      borderColor: '#2b6777'
    };
    
    const acceptStyle = {
      borderColor: '#52ab98'
    };
    
    const rejectStyle = {
      borderColor: 'red'
    };

    
    return {
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isFileAccepted ? acceptStyle : {}),
      ...(isFileRejected ? rejectStyle : {})
    }
  }, [isDragActive, isFileAccepted, isFileRejected]);

  const errorMessage = error ? (
    <>
      Your file is rejected for following reasons:
      <div className="error">{error}</div>
    </>
  ) : null;

  return (
    <div className="container">
      <div className="title">Upload a file</div>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} type="file"/>
        <div>Drag and drop file here or click to select from File Manager</div>
      </div>
      <div className="messages">
        {isFileAccepted && file && fileFromParent && !isFileRejected? <div>Succesfully uploaded <b>{file.name}</b> file</div> : null}
        {isFileRejected && !isFileAccepted ? errorMessage : null}
      </div>
    </div>
  )
};


export default FileUploader;