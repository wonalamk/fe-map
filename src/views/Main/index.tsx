import React, { useEffect, useRef, useState } from 'react'
import Button, { BUTTON_TYPES } from '../../components/Button';
import FileParser from '../../components/FileParser';
import FileUploader from '../../components/FileUploader';

import "./styles.scss";

const Main = () => {

  const [file, setFile] = useState<File>();
  const [delimiter, setDelimiter] = useState<string>(',');
  const [headerIncluded, setHeaderIncluded] = useState<boolean>(false);
  
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState<React.RefObject<HTMLDivElement>>(step1Ref);
  const [error, setError] = useState<string>();

  const onFileUploaded = (file: File, delimiter: string, removeHeaders: boolean) => {
    setFile(file);
    setDelimiter(delimiter);
    setHeaderIncluded(removeHeaders);
  }

  useEffect(() => {
    scrollToStep(currentStep);
  }, [currentStep])

  const scrollToStep = (ref:React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  const moveToNextStep = (step: number) => {
    switch (step) {
      case 2: 
        if (file) {
          setCurrentStep(step2Ref);
        } else {
          window.alert("Upload a file first");
        }
        break;
      default:
    }
  }

  const step1 = (
    <div className="step-container" ref={step1Ref}>
        <FileUploader onFileUploaded={onFileUploaded}/>
        <Button label="Next" type={BUTTON_TYPES.primary} disabled={file ? false : true} onClick={() => moveToNextStep(2)}/>
    </div>
  )

  const step2 = file && currentStep === step2Ref ? (
    <div className="step-container" ref={step2Ref}>
        <FileParser file={file} delimiter={delimiter} headerIncluded={headerIncluded} errorCallback={() => setCurrentStep(step1Ref)}/>
    </div>
  ) : null;

  return (
    <div className="main-container">
      {step1}
      {step2}      
    </div>
  )
};


export default Main;