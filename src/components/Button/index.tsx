import React from 'react';

import './styles.scss';

export enum BUTTON_TYPES {
  primary = 'primary',
  secondary = 'secondary'
}

interface ButtonProps {
  disabled?: boolean;
  label: string;
  type: BUTTON_TYPES;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {

  return (
    <div className={`button-container ${props.type} ${props.disabled ? 'disabled' : ''}`} onClick={props.onClick}>
      {props.label}
    </div>
  )
}

export default Button;