document.addEventListener('DOMContentLoaded', () => {

  // Gets the node-container div
  const nodeTemplate = document.querySelector('.node-container');
  if (!nodeTemplate) {
    return;
  }

  // Hides the template
  nodeTemplate.style.display = 'none';
  nodeTemplate.style.visibility = 'hidden';

  // Loads the sector data from JSON for the title of the node (TEMPORARY)
  let mapData = {};
  fetch('/Data/map_data.json')
    .then(response => response.json())
    .then(data => {
      mapData = data;
    })
    .catch(error => {
    });

  // Creates a new node by cloning the template one
  function createNode(sectorId, sectorRect) {
    console.log('Created:', sectorId);

    // Makes a clone of the original node-container
    const newNode = nodeTemplate.cloneNode(true);

    // Gives the new cloned node a the same ID number as the scetor that has been clicked to show the node
    newNode.id = `node-${sectorId}`;
    newNode.setAttribute('data-sector-id', sectorId);

    // CSS stuff
    newNode.style.display = 'flex';
    newNode.style.visibility = 'visible';
    newNode.style.position = 'absolute';
    newNode.style.top = '0';
    newNode.style.left = '0';
    newNode.style.zIndex = '10';

    // Gets sector data from mapData and diferentiates normal from base sectors as to not ad the "Sector " part in base sector names
    const sectorData = mapData[sectorId];
    const titleElement = newNode.querySelector('.node-header .title');
    if (titleElement && sectorData) {
      const value = sectorData.number || sectorData.name || 'Unknown Sector';
      if (!isNaN(Number(value))) {
        titleElement.textContent = `Sector ${value}`;
      } else {
        titleElement.textContent = value;
      }
    }


    // Node offset and viewport constraints
    const margin = 10;
    const offset = 40;
    let newX = sectorRect.right + offset;
    let newY = sectorRect.top - 120;
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 300;
    if (newX > maxX) {
      newX = sectorRect.left - 200 - offset; // If too far right just makes the node generate on the left side (dont need one for the left side since it always gens on the right)
    }
    newX = Math.max(margin, Math.min(newX, maxX));
    newY = Math.max(margin, Math.min(newY, maxY));

    // Finaly sets the position
    newNode.style.left = `${newX}px`;
    newNode.style.top = `${newY}px`;

    // Actually places it into <body>
    document.body.appendChild(newNode);

    return newNode;
  }

  // Gives all sectors event listeners for clicks
  setTimeout(() => {
    const sectors = document.querySelectorAll('polygon.sector');

    // Loops thorugh all sectors
    sectors.forEach((sector, index) => {
      sector.addEventListener('click', (e) => {

        const sectorId = sector.getAttribute('id');
        if (!sectorId) {
          return;
        }

        // Logic for multiple opened nodes at the same time holding down ctrl key
        const sectorRect = sector.getBoundingClientRect();
        const isCtrlPressed = e.ctrlKey;

        // If ctrl is not pressed while other nodes are existing then it will close them and open the node that belongs to the sector that was pressed without holding down ctrl
        if (!isCtrlPressed) {
          const existingNodes = document.querySelectorAll('.node-container[data-sector-id]');
          existingNodes.forEach(node => node.remove());
        }

        // Removes node if it already exists when clicked again otherwise it jsut creates a new one
        const existingNode = document.querySelector(`#node-${sectorId}`);
        if (existingNode) {
          existingNode.remove();
          return;
        } else {
          createNode(sectorId, sectorRect);
        }
      });
    });
  }, 500); // time to wait for data_renderer.js to render the polygons information form the JSON before node creation can work
});