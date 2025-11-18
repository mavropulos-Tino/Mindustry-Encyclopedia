const node = document.querySelector(".node-container");

// Attaches click listener to closest (clicked) polygon and exits early if one isnt clicked
document.addEventListener("click", (event) => {
  const polygon = event.target.closest("polygon");
  if (!polygon) {return};

  const sectorId = polygon.id;
  node.id = sectorId;

  // Gets the bounding box of the polygon so we can correctly position the node next to the polygon
  const boundingBox = polygon.getBoundingClientRect();

  // Offset values so no overlap happens with the polygon
  const offsetX = 50;
  const offsetY = -200;

  // Gets the node containers actual dimensions so we can later check if some part of the node will be out-of-bounds and correct for that
  const nodeWidth = node.offsetWidth;
  const nodeHeight = node.offsetHeight;

  // Calculates the final position of the node + the offset in relative to the polygon
  let left = boundingBox.right + offsetX;
  let top = boundingBox.top + offsetY;

  // Gets the view port dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Checking if the node will be out-of-bounds and corrects for it
  if (left + nodeWidth > viewportWidth) {
    left = boundingBox.left - nodeWidth - offsetX;
  }
  if (left < 0) {
    left = 10;
  }
  if (top + nodeHeight > viewportHeight) {
    top = viewportHeight - nodeHeight - 10;
  }
  if (top < 0) {
    top = 10;
  }

  // Actually sets the nodes left and top position and then just sets the node to be visible
  node.style.left = `${left}px`;
  node.style.top = `${top}px`;
  node.style.display = "block";
});