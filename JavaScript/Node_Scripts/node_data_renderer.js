document.addEventListener("DOMContentLoaded", () => {
  const node = document.querySelector(".node-container");
  let sectorData = {};

  // 1️⃣ Fetch JSON data
  fetch("../Data/Node_Data/sector_data.json")
    .then(response => response.json())
    .then(data => {
      sectorData = data;
      // console.log("Sector data loaded:", sectorData);
    })
    .catch(err => console.error("Failed to load sector data:", err));

  // 2️⃣ Function to populate node
  function populateNode(nodeElement) {
    const sectorId = nodeElement.id;
    const data = sectorData[sectorId];
    if (!data) return;

    Object.keys(data).forEach(key => {
      const className = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
      const span = nodeElement.querySelector(`.node-value.${className}`);
      if (!span) return;

      if (Array.isArray(data[key])) {
        span.textContent = data[key].join(", ");
      } else {
        span.textContent = data[key];
      }
    });
  }

  // 3️⃣ Populate on polygon click
  document.addEventListener("click", (event) => {
    const polygon = event.target.closest("polygon");
    if (!polygon) return;

    // Node ID is already set in your previous script
    populateNode(node);
  });
});
