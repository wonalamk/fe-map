import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import '@fortawesome/fontawesome-free-solid';

interface LocationPinProps {
  lat: number;
  lng: number;
  color: string;
  address: string;
  key: number;
}
const LocationPin: React.FC<LocationPinProps> = (props) => {
  return (
    <div key={props.key}>
      <FontAwesomeIcon icon={'map-pin'} color={props.color} size="3x"/>
    </div>

  )
}

export default LocationPin;