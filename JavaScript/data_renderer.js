// Gets all points of <polygon> calculates the center and returns X and Y cords
function getPolygonCenter(pointsString) {
  // Parse the points string into an array of [x, y] coordinates
  const points = pointsString.trim().split(/\s+/).map(point => {
    const [x, y] = point.split(',').map(Number);
    return { x, y };
  });
  
  // Gets the avrage of all points
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  
  return { x: centerX, y: centerY };
}

// Makes the <text> element...
function createTextElement(center, text, fontSize) {
  const svgNS = 'http://www.w3.org/2000/svg';
  
  // Creates, centers and makes a styling class for the <text> element
  const textElement = document.createElementNS(svgNS, 'text');
  textElement.setAttribute('x', center.x);
  textElement.setAttribute('y', center.y);
  textElement.setAttribute('text-anchor', 'middle');
  textElement.setAttribute('dominant-baseline', 'middle');
  textElement.setAttribute("class", "text");
  
  // Checks if there are spaces, if there are it will split the word put each word in its own tspan and AI wizardy after that
  if (text.includes(' ')) {
    const words = text.split(' ');
    const lineHeight = fontSize * 1.2;
    const totalHeight = (words.length - 1) * lineHeight;
    const startY = -totalHeight / 2;
    
    words.forEach((word, index) => {
      const tspan = document.createElementNS(svgNS, 'tspan');
      tspan.setAttribute('x', center.x);
      tspan.setAttribute('dy', index === 0 ? startY : lineHeight);
      tspan.textContent = word;
      textElement.appendChild(tspan);
    });
  } else {
    // If its a regular numbered sector and not a "base" sector it will just normaly apply the JSON number value
    textElement.textContent = text;
  }
  
  return textElement;
}

// Applys the sector data...
async function applySectorData() {
  try {
    // Fetches the JSON data
    const response = await fetch('/Data/map_data.json');
    const mapData = await response.json();
    
    // Loop through all <polygon> elements with id="sector-..."
    const polygons = document.querySelectorAll('polygon.sector');
    polygons.forEach(polygon => {
      const sectorId = polygon.getAttribute('id');
      
      // Checks if polygons id has a corresponding value in the JSON
      if (mapData[sectorId]) {
        const sectorData = mapData[sectorId];
        
        // Fills the polygon with the color value form the JSON
        polygon.setAttribute('fill', sectorData.color);
        
        // Gets all <polygon> points, sends them to getPolygonCenter()
        const pointsString = polygon.getAttribute('points');
        const center = getPolygonCenter(pointsString);
        
        // AI wizardry again
        const fontSize = sectorData.number.includes(' ') ? 18 : 24;
        const textElement = createTextElement(center, sectorData.number, fontSize);
        polygon.parentNode.insertBefore(textElement, polygon.nextSibling);
      }
    });
    
  } catch (error) {
  }
}
// Wait for site to load before running
document.addEventListener('DOMContentLoaded', applySectorData);