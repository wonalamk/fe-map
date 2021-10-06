import React, { useEffect, useRef, useState } from "react";
import Button, { BUTTON_TYPES } from "../../components/Button";
import FileParser, { Field } from "../../components/FileParser";
import FileUploader from "../../components/FileUploader";
import MapComponent from "../../components/MapComponent";

import "./styles.scss";

const Main = () => {
  const [file, setFile] = useState<File>();
  const [delimiter, setDelimiter] = useState<string>(",");
  const [headerIncluded, setHeaderIncluded] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<string[][]>();
  const [fields, setFields] = useState<Field[]>();
  const [step2Error, setStep2Error] = useState<boolean>(false);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] =
    useState<React.RefObject<HTMLDivElement>>(step1Ref);

  const cleanUp = () => {
    setCurrentStep(step1Ref);
    setFile(undefined);
    setDelimiter(",");
    setHeaderIncluded(false);
    setStep2Error(false);
  };

  const errorCallback = () => {
    setStep2Error(true);
  };

  const onFileUploaded = (file: File) => {
    setFile(file);
  };

  useEffect(() => {
    scrollToStep(currentStep);
  }, [currentStep]);

  const scrollToStep = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const moveToNextStep = (step: number) => {
    switch (step) {
      case 2:
        if (file) {
          setCurrentStep(step2Ref);
        } else {
          window.alert("Upload a file first");
        }
        break;
      case 3:
        if (parsedData?.length !== 0 && fields?.length !== 0) {
          setCurrentStep(step3Ref);
        }
        break;
      default:
    }
  };

  const selectDelimiter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDelimiter(event.target.value === "Comma" ? "," : ";");
  };

  const selectHeader = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderIncluded(event.target.value === "yes" ? true : false);
  };

  const saveParsedData = (data: string[][], fields: Field[]) => {
    setParsedData(data);
    setFields(fields);
  };

  const step1 = (
    <div className="step-container" ref={step1Ref}>
      <FileUploader onFileUploaded={onFileUploaded} file={file} />
      <div className="options">
        <div className="title">Upload options</div>
        <div className="select-option">
          <div>Select delimiter</div>
          <select name="delimiter" onChange={selectDelimiter} value="Comma">
            <option>Comma</option>
            <option>Semicolon</option>
          </select>
        </div>
        <div className="select-option">
          <div>Header included</div>
          <div className="radio-buttons">
            <div>
              <input
                type="radio"
                name="headers"
                value="yes"
                onChange={selectHeader}
                checked={headerIncluded}
              />
              <label>Yes</label>
            </div>
            <input
              type="radio"
              name="headers"
              value="no"
              onChange={selectHeader}
              checked={!headerIncluded}
            />
            <label>No</label>
          </div>
        </div>
      </div>
      <Button
        label="Next"
        type={BUTTON_TYPES.primary}
        disabled={file ? false : true}
        onClick={() => moveToNextStep(2)}
      />
    </div>
  );

  const step2 =
    file && currentStep === step2Ref ? (
      <div className="step-container" ref={step2Ref}>
        <FileParser
          file={file}
          delimiter={delimiter}
          headerIncluded={headerIncluded}
          errorCallback={errorCallback}
          successCallback={saveParsedData}
        />
        <Button
          label="Next"
          type={BUTTON_TYPES.primary}
          disabled={
            typeof parsedData === "undefined" ||
            typeof fields === "undefined" ||
            step2Error
          }
          onClick={() => moveToNextStep(3)}
        />
      </div>
    ) : null;

  const step3 =
    currentStep === step3Ref &&
    parsedData &&
    parsedData?.length !== 0 &&
    fields &&
    fields?.length !== 0 ? (
      <div className="step-container" ref={step3Ref}>
        <MapComponent data={parsedData!} fields={fields!} />
      </div>
    ) : null;

  return (
    <div className="main-container">
      <div className="home-button-container">
        <Button label="Home" onClick={cleanUp} type={BUTTON_TYPES.secondary} />
      </div>
      {step1}
      {step2}
      {step3}
    </div>
  );
};

export default Main;
