import $ from 'jquery';

let getCapabilitiesLayers;

function xmlToArray(xmlDoc) {
  getCapabilitiesLayers = $(xmlDoc).find('Layer > Name').map(function fullLayerName() {
  // getCapabilitiesLayers = $(xmlDoc).find('FeatureType > Name').map(function fullLayerName() {
    return $(this).text();
  }).get();

  getCapabilitiesLayers.forEach((getCapabilitiesLayer, i) => {
    const data = getCapabilitiesLayer.split(':');
    getCapabilitiesLayers[i] = data.pop();
  });
}

function responseParser(response) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(response, 'text/xml');
  xmlToArray(xmlDoc);
}

const getCapabilities = function getCapabilities(getCapabilitiesURL) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function parseResponse() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      responseParser(xmlHttp.responseText);
    }
  };
  xmlHttp.open('GET', getCapabilitiesURL, false); // true for asynchronous
  xmlHttp.send(null);

  return getCapabilitiesLayers;
};

export default getCapabilities;
