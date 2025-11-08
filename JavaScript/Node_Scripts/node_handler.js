document.addEventListener('DOMContentLoaded', () => {
  const nodeContainer = document.querySelector('.node-container');
  const nodeHeader = document.querySelector('.node-header');
  
  let isDragging = false;
  let startX, startY, offsetX = 0, offsetY = 0;
  
  // Loops through all polygons with class "sector" and adds an EventListner
  const sectors = document.querySelectorAll('polygon.sector');
  sectors.forEach(sector => {
    sector.addEventListener('click', (e) => {
      // Adds the class "show" to the node-container to become visible
      nodeContainer.classList.add('show');
      
      // Gets the position of the clicked polygon like relative to the page size
      const sectorRect = sector.getBoundingClientRect();
      const nodeRect = nodeContainer.getBoundingClientRect();
      
      // Offsets the Node to the right and up a little bit
      let newX = sectorRect.right + 40;
      let newY = sectorRect.top - 120;
      
      // Checks if any part of the node will be outside the viewport -10px margin for aesthetics
      const margin = 10;
      const maxX = window.innerWidth - nodeRect.width - margin;
      const maxY = window.innerHeight - nodeRect.height - margin;
      const minX = margin;
      const minY = margin;
      
      // Checks if the X axis offset will put the node outside of the viewport, if yes then inverts the offset
      if (newX > maxX) {
        newX = sectorRect.left - nodeRect.width - 40;
      }
      
      // Clamps to minX if it goes to far left outside the viewport
      if (newX < minX) {
        newX = minX;
      }
      
      // Same thing for -Y
      if (newY > maxY) {
        newY = maxY;
      }
      
      // Same thing for +Y
      if (newY < minY) {
        newY = minY;
      }
      
      // Passes the X and Y onto temp variables and translates the node_container to their possition
      offsetX = newX;
      offsetY = newY;
      nodeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
  
  // Listens for a mouse down, updates the boolean = starts the dragging functionality
  nodeHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    nodeContainer.style.transition = 'none'; //Dissables transition propperty for smoother dragging
  });
  
  // Mouse dragging logic...
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) {
      return;
    } else {
    
    // Gets true coordinates by mous position by start offset
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;
    
    // Dimensions
    const rect = nodeContainer.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    // Constrains
    offsetX = Math.max(0, Math.min(newX, maxX));
    offsetY = Math.max(0, Math.min(newY, maxY));
    
    // Applys position
    nodeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  });
  
  // Sets boolean to false and stops dragging process and resets transition
  document.addEventListener('mouseup', () => {
    isDragging = false;
    nodeContainer.style.transition = '';
  });
});