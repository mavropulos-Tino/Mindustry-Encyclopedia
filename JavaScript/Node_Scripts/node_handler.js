document.addEventListener('DOMContentLoaded', () => {

  // Gives all the buttons inside the node an event listener for clicks
  document.body.addEventListener('click', (event) => {
    const closeButton = event.target.closest('.node-close-button');
    if (!closeButton) return;

    // When clicked just removes the closest node-contaienr to it (lazy method)
    const nodeContainer = closeButton.closest('.node-container');
    if (!nodeContainer) return;
    nodeContainer.remove();
  });
});