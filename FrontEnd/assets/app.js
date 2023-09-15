/**
 * The URL to the API.
 */
const API = "http://localhost:5678/api";

const getWorks = async () => {
  // Fetch the works from the API
  let works;
  try {
    const res = await fetch(`${API}/works`);
    works = await res.json();
  } catch {
    alert("Une erreur est survenue lors du chargement des projets.");
    return;
  }

  // Generate the HTML
  const nodes = [];
  works.forEach((work) => {
    // Create the elements
    const figureEl = document.createElement("figure");
    const imgEl = document.createElement("img");
    const figcaptionEl = document.createElement("figcaption");
    // Add the data
    imgEl.src = work.imageUrl;
    imgEl.alt = work.title;
    figcaptionEl.textContent = work.title;
    // Generate the final node
    figureEl.append(imgEl, figcaptionEl);
    nodes.push(figureEl);
  });

  // Add the works to the gallery
  document.querySelector(".gallery")?.append(...nodes);
};

getWorks();
