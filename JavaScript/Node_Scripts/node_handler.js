document.addEventListener('DOMContentLoaded', () => {

  // Gives all the buttons inside the node an event listener for clicks
  document.body.addEventListener('click', (event) => {
    const closeButton = event.target.closest('.node-close-button');
    if (!closeButton) return;

    // When clicked just removes the closest node-container to it (lazy method)
    const nodeContainer = closeButton.closest('.node-container');
    if (!nodeContainer) return;
    nodeContainer.remove();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  let activeNode = null;
  let offsetX = 0;
  let offsetY = 0;

  // Makes sure it doesnt not go outside viewport
  const clamp = (x, y, w, h) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return [Math.max(0, Math.min(x, vw - w)), Math.max(0, Math.min(y, vh - h))];
  };

  // Z index
  let topZ = 10;

  // Detects if mosue down is happening over header element of node
  document.addEventListener('mousedown', (e) => {
    const header = e.target.closest('.node-header');
    if (!header) return;

    const node = header.closest('.node-container');
    if (!node) return;

    // Brings the current node being dragged above other nodes
    topZ += 1;
    node.style.zIndex = topZ;

    // No transition while being dragged so its not jittery and laggy
    node.style.transition = 'none';

    // Gets node position relative to the viewport and caluclates offset so node anchor point doesnt jump to the position of the mouse upon mouseDown
    const rect = node.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // CSS properties
    activeNode = node;
    header.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  });

  // Dragging logic
  document.addEventListener('mousemove', (e) => {
    // if activeNode returns nothing that means no mouseDown event happening so that means use ris holding down anything and it exits
    if (!activeNode) return;

    // Gets node position relatuive to viewport and uses offset value to make sure when dragging the position the nodes beign dragged from doesnt 'slip'
    const rect = activeNode.getBoundingClientRect();
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;
    [newLeft, newTop] = clamp(newLeft, newTop, rect.width, rect.height); // Makes sure any part of the node doesnt go offscreen

    // sets final position after every drag or mouse move while mouse is down
    activeNode.style.left = `${newLeft}px`;
    activeNode.style.top = `${newTop}px`;
  });

  // Same logic as mouseMove
  document.addEventListener('mouseup', () => {
    if (!activeNode) return;

    // Changes cursor from grabbing to grab once dragging is over
    const header = activeNode.querySelector('.node-header');
    if (header) header.style.cursor = 'grab';

    // restore transition for the :hover pseudo element for the box shadow AND resets the acitveNode back to not active
    activeNode.style.transition = '';
    activeNode = null;
    document.body.style.userSelect = '';
  });
});