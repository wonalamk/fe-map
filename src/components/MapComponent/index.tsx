
import React, { useEffect, useState } from 'react';
import { Field } from '../FileParser';
import GoogleMapReact from 'google-map-react'
import LocationPin from './LocationPin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free-solid';

import './styles.scss'


interface MapComponentProps {
  data: string[][];
  fields: Field[];
}

interface ColorEntry {
  category: string;
  color: string;
}

const MapComponent: React.FC<MapComponentProps> = (props) => {
  const center = {lat: 42.94, lng:-101.626};
  const zoom = 1;
  const data = props.data;

  const [addresses, setAddresses] = useState<string[]>();

  const openCageDataApiKey = process.env.REACT_APP_OPEN_CAGE_DATA_KEY;
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;
  
  const [geoCodes, setGeocodes] = useState<any[]>([]);
  const [colors, setColors] = useState<ColorEntry[]>([]);

  const cityIndex = props.fields.find(i => i.key === 'city')?.value!;
  const stateIndex = props.fields.find(i => i.key === 'state')?.value!;
  const zipIndex = props.fields.find(i => i.key === 'zip')?.value!;
  const addressIndex = props.fields.find(i => i.key === 'address')?.value!;
  const categoryIndex = props.fields.find(i => i.key === 'category')?.value!

  useEffect(() => {
    const getAddress = (entry: string[]) => {
      return [entry[addressIndex], entry[cityIndex], entry[stateIndex], entry[zipIndex]].join(' ');
    }
    const adr = data.map((entry: string[]) => getAddress(entry));

    setAddresses(adr);
   
  }, [addressIndex, cityIndex, data, stateIndex, zipIndex]);

  useEffect(() => {
    if (addresses && addresses.length !== 0) {
      const geoPromises = addresses.map((addr) => {
        return fetch(`https://api.opencagedata.com/geocode/v1/json?key=${openCageDataApiKey}&q=${addr}&limit=1`)
          .then((res) => res.json())
          .then((response) => {
            return response?.results[0]?.geometry
          });
      });
      Promise.all(geoPromises).then((values) => {
        setGeocodes(values)
      });
    }
  }, [addresses, openCageDataApiKey])

  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    const categories: string[] = [];
    const colorsPerCategory: ColorEntry[]= [];

    data?.forEach((entry) => {
      if (!categories.includes(entry[categoryIndex])) {
        colorsPerCategory.push({
          category: entry[categoryIndex],
          color: getRandomColor(),
        });
        categories.push(entry[categoryIndex]);
      }
    })
    setColors(colorsPerCategory); 
  }, [categoryIndex, data, geoCodes])


  const markers = geoCodes && geoCodes.length !== 0 ? geoCodes.map((geocode, index) => {
    if (geocode) {
        return (
        <LocationPin 
          lat={geocode.lat}
          lng={geocode.lng}
          color={colors.find((color) => color.category === data[index][categoryIndex])?.color ?? 'black'}
          address={addresses ? addresses[index] : ''}
          key={index}
        />
        )
    } else {return null}
  })  : null;

  return  (
    <div className="map">
      <div style={{ height: '40em', width: '40em' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: googleMapsApiKey ?? '' }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
      {markers}
      </GoogleMapReact>
    </div>

      <div className="legend">
        {colors.map((entry, index) => (
          <div className="legend-entry" key={index}>
            <FontAwesomeIcon icon={'map-pin'} color={entry.color} size="3x"/>
            <div className="category-name">{entry.category}</div>
          </div>
        ))}
      </div>
  </div>
  )
}

export default MapComponent;