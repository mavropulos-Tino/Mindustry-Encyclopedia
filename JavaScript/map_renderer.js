function getPolygonCenter(pointsSequence) {
  const points = pointsSequence
    .trim()
    .split(/\s+/)
    .map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });

  const sumX = points.reduce((a, p) => a + p.x, 0);
  const sumY = points.reduce((a, p) => a + p.y, 0);

  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

function createTextElement(center, text) {
  const svgNS = "http://www.w3.org/2000/svg";
  const t = document.createElementNS(svgNS, "text");
  t.setAttribute("x", center.x);
  t.setAttribute("y", center.y);
  t.setAttribute("text-anchor", "middle");
  t.setAttribute("dominant-baseline", "middle");
  t.setAttribute("class", "text");
  t.textContent = text;
  return t;
}

async function drawMap() {
  const response = await fetch("./Data/map_data.json");
  const data = await response.json();

  const svgNS = "http://www.w3.org/2000/svg";
  const sectorGroup = document.getElementById("sectors");

  for (const [id, sector] of Object.entries(data)) {
    const polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("id", id);
    polygon.setAttribute("class", "sector");
    polygon.setAttribute("points", sector.points);
    polygon.setAttribute("fill", sector.color);

    sectorGroup.appendChild(polygon);

    const center = getPolygonCenter(sector.points);
    const textElem = createTextElement(center, sector.number);
    sectorGroup.appendChild(textElem);
  }
}

document.addEventListener("DOMContentLoaded", drawMap);