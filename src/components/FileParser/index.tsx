import React, { useEffect, useState } from "react";
import { parse } from "papaparse";
import Table from "../Table";

import "./styles.scss";

interface FileParserProps {
  file: File;
  delimiter: string;
  headerIncluded: boolean;
  errorCallback: () => void;
  successCallback: (data: string[][], fields: Field[]) => void;
}

export interface Field {
  key: string;
  value: number;
}

const FileParser: React.FC<FileParserProps> = ({
  file,
  delimiter,
  headerIncluded,
  errorCallback,
  successCallback,
}) => {
  const [data, setData] = useState<string[][]>();
  const [header, setHeader] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectionErrors, setSelectionErrors] = useState<string>();
  const [fields, setFields] = useState<Field[]>([]);

  const options = ["city", "state", "zip", "address", "category"];

  useEffect(() => {
    parse(file, {
      delimiter,
      complete: (result) => {
        const data = result.data as string[][];
        if (headerIncluded) {
          setHeader(data[0]);
          setData(data.slice(1));
        } else {
          setData(data);
          const mockedHeader = [];
          for (let i = 0; i < data[0].length; i++) {
            mockedHeader.push(`Column ${i + 1}`);
          }
          setHeader(mockedHeader);
        }
      },
    });
  }, [delimiter, errors, file, headerIncluded]);

  useEffect(() => {
    if (data) {
      let lengths = new Set();
      const errorMessages = [];

      data.forEach((row) => {
        lengths.add(row.length);
      });

      if (lengths.size !== 1) {
        errorMessages.push(
          "Data corrupted. At least one row has different length than the others."
        );
      }

      if (lengths.values().next().value < 5) {
        errorMessages.push("Your file should contain at least 5 columns");
      } else if (data.length > 20) {
        errorMessages.push(
          "Too much data. Your file should contain no more than 20 rows."
        );
      }
      if (errorMessages.length !== 0) {
        setErrors(errorMessages);
        errorCallback();
      }
    }
  }, [data, errorCallback]);

  useEffect(() => {
    if (data && data.length !== 0 && fields.length === options.length) {
      successCallback(data!, fields);
    }
  });

  const setField = (option: string, value: number) => {
    setSelectionErrors(undefined);
    const isSelectionDuplicated = fields.filter(
      (field) => field.value === value
    );
    if (isSelectionDuplicated.length !== 0) {
      setSelectionErrors("Select unique column for each dropdown.");
    } else {
      setFields([...fields, { key: option, value }]);
    }
  };

  const errorMessage =
    errors.length !== 0 ? (
      <div className="errors">
        <div className="title">Following errors occured:</div>
        {errors.map((error, index) => (
          <div className="error" key={index}>{error}</div>
        ))}
      </div>
    ) : null;

  const listOfColumnsOptions = header.map((entry, index) => (
    <option value={index} key={index}>{entry}</option>
  ));

  const selects = options.map((option, index) => {
    return (
      <div className="select" key={index}>
        <div className="select-title">
          Select column that represents <b>{option}</b>:
        </div>
        <select
          name={option}
          onChange={(e) =>
            setField(option, e.target.value as unknown as number)
          }
        >
          <option disabled selected>
            -- select an option --
          </option>
          {listOfColumnsOptions}
        </select>
      </div>
    );
  });

  const content = (
    <>
      <Table data={data!} header={header} />
      <div className="selects">
        {selects}
        {selectionErrors ? (
          <div className="selection-error">{selectionErrors}</div>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="file-parser">
      {errorMessage ?? (data ? content : "Data loading")}
    </div>
  );
};

export default FileParser;
