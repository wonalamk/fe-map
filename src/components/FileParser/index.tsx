import React, { useCallback, useEffect, useState } from 'react';
import { parse } from 'papaparse';
import Table from '../Table';
import Button, { BUTTON_TYPES } from '../Button';

import './styles.scss';

interface FileParserProps {
  file: File;
  delimiter: string;
  headerIncluded: boolean;
  errorCallback: () => void;
}

const FileParser: React.FC<FileParserProps> = ({file, delimiter, headerIncluded, errorCallback}) => {
  const [data, setData] = useState<string[][]>();
  const [header, setHeader] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const options = ['city', 'state', 'zip', 'address', 'category']

  useEffect(() => {
    parse(file, {
      delimiter,
      complete: (result) => {
      const data = result.data as string[][];
        if (headerIncluded) {
          setHeader(data[0]);
          setData(data.slice(1))
        } else {
          setData(data)
          const mockedHeader = [];
          for (let i = 0; i < data[0].length; i++) {
            mockedHeader.push(`Column ${i + 1}`);
          }
          setHeader(mockedHeader);
        }
      }
    });
  }, [delimiter, errors, file, headerIncluded]);

 useEffect(() => {

  if (data) {
    let lengths = new Set();
    const errorMessages = [];

    data.forEach((row) => {
      lengths.add(row.length)
    }); 

    if (lengths.size !== 1) {
      errorMessages.push("Data corrupted. At least one row has different length than the others.")
    }

    console.log(lengths.values().next().value)
    if (lengths.values().next().value < 5) {
      errorMessages.push("Your file should contain at least 5 columns");
    }
    else if (data.length > 20) {
      console.log("lens",data.length, data)
      errorMessages.push("Too much data. Your file should contain no more than 20 rows.");
    }
    if (errorMessages.length !== 0) {
      setErrors(errorMessages);
    }
  }

 }, [data])

  const errorMessage = errors.length !== 0  ? (
    <div className="errors">
      <div className="title">Following errors occured:</div>
      {errors.map((error) => (<div className="error">{error}</div>))}
      <Button type={BUTTON_TYPES.primary} label="Go back" onClick={errorCallback}/>
    </div>
  ) : null;
  
  const listOfColumnsOptions = header.map((entry) => (<option>{entry}</option>));

  const selects = options.map((option) => {
    return (
      <div className="select">
        <div className="select-title">Select column that represents <b>{option}</b>:</div>
        <select name={option}>
          {listOfColumnsOptions}
        </select>
      </div>
    )
  })

  const content =  (
    <>
      <Table data={data!} header={header}/>
      <div className="selects">{selects}</div>
    </>
  )
  
  return (
    <div className="file-parser">
      {errorMessage ?? (data ? content : 'Data loading')}
    </div>
  )
}

export default FileParser;