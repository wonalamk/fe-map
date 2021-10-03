import React, { CSSProperties, useCallback, useMemo,  useState } from 'react';
import {DropzoneOptions, useDropzone} from 'react-dropzone'

import "./styles.scss";

interface FileUploaderProps {
  onFileUploaded: (file: File, delimiter: string, removeHeaders: boolean) => void;
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

const FileUploader: React.FC<FileUploaderProps> = ({onFileUploaded}) => {
  const [file, setFile] = useState<File>();
  const [isFileRejected, setIsFileRejected] = useState<boolean>();
  const [isFileAccepted, setIsFileAccepted] = useState<boolean>();
  const [error, setError] = useState<JSX.Element>(<></>);
  const [delimiter, setDelimiter] = useState<string>(',');
  const [headerIncluded, setHeaderIncluded] = useState<boolean>(true);


  const onDrop = useCallback(droppedFile => {
    if (droppedFile[0]) {
      setFile(droppedFile[0])
      onFileUploaded(droppedFile[0], delimiter, headerIncluded);
    }
  },[delimiter, onFileUploaded, headerIncluded]);

  
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
      transition: 'border .24s ease-in-out',
      height: '20em'
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

  const selectDelimiter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDelimiter(event.target.value === 'Comma' ? ',' : ';');
  }

  const selectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderIncluded(event.target.value === 'yes' ? true : false);
  }
  return (
    <div className="container">
      <div className="title">Upload a file</div>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} type="file"/>
        <div>Drag and drop file here or click to select from File Manager</div>
      </div>

      <div className="options">
        <div className="title">Upload options</div>
        <div className="select-option">
          <div>Select delimiter</div>
          <select name="delimiter" onChange={selectDelimiter} value='Comma'>
            <option>Comma</option>
            <option>Semicolon</option>
          </select>
        </div>

        <div className="select-option">
          <div>Header included</div>

          <div className="radio-buttons">
            <div>
              <input type="radio" name="headers" value="yes" onChange={selectHeader} checked={headerIncluded}/>
              <label>Yes</label>
            </div>

              <input type="radio" name="headers" value="no" onChange={selectHeader} checked={!headerIncluded}/>
              <label>No</label>
          </div>
         
        </div>
        
      </div>

      <div className="messages">
        {isFileAccepted && file && !isFileRejected? <div>Succesfully uploaded <b>{file.name}</b> file</div> : null}
        {isFileRejected && !isFileAccepted ? errorMessage : null}
      </div>
    </div>
  )
};


export default FileUploader;