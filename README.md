# Fe-map

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It consists of a Single Page Application that accepts csv upload with filve columns of up to 20 rows of information.
Those rows are parsed and based on data application displays addresses on the map. Each category is represented with diifferent color of marker.

## Technologies used

To implement this project, **React** with **TypeScript** were used. Each component is implemented as a Functional Component with use of Hooks. 

To style the project, **Sass** was used. 

CSV upload and parsing was made with **React Dropzone** and **Papaparse** libraries.

To display addresses on the map, it was needed to get latitude and longitude of the address. It was made with **Open Cage Data API**. 

**Google Maps** were used as a map component. 

Marker icon comes from **Font Awesome** library.

Project was deployed with **Netlify** and is available at https://fe-map.netlify.app.

## Additional work needed
Due to limited time, the implementation of the tests was omitted.
