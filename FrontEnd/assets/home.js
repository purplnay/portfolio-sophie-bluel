/**
 * Generate the HTML for a work.
 * @param {Object} work A work from the API.
 * @returns The node for this work.
 */
const generateWorkEl = (work) => {
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

    return figureEl;
};

/**
 * Generate the HTML for a filter (does not create event handlers).
 * @param {string} filter The category name.
 * @returns The HTML element for the filter.
 */
const generateFilterEl = (filter) => {
    const li = document.createElement("li");
    li.innerText = filter;
    li.classList.add("filters-item");

    return li;
};

/**
 * Filter the given works using the given filter.
 * @param {Object[]} works The works to filter.
 * @param {string} filter The filter.
 * @returns The works that match the filter.
 */
const filterWorks = (works, filter) => {
    // Return all if the filter is "Tous"
    if (filter === "Tous") {
        return works;
    }

    return works.filter((work) => work.category.name === filter);
};

/**
 * Render the elements for works and filters to the page.
 * @param {Object[]} works The works from the API.
 * @param {Set<string>} filters The categories of works.
 * @param {string} activeFilter The active filter.
 */
const render = (works, filters, activeFilter = "Tous") => {
    // Generate (filtered) work nodes
    const workNodes = [];
    filterWorks(works, activeFilter).forEach((work) => {
        const el = generateWorkEl(work);
        workNodes.push(el);
    });

    // Generate filter nodes
    const filterNodes = [];
    filters.forEach((filter) => {
        const el = generateFilterEl(filter);

        if (activeFilter === filter) {
            el.classList.add("active");
        } else {
            // Add event listener
            el.addEventListener("click", () => {
                render(works, filters, filter);
            });
        }

        filterNodes.push(el);
    });

    // Add to the dom
    const galleryEl = document.querySelector(".gallery");
    galleryEl.innerHTML = "";
    galleryEl.append(...workNodes);
    const filtersEl = document.querySelector(".filters");
    filtersEl.innerHTML = "";
    filtersEl.append(...filterNodes);
};

document.addEventListener("DOMContentLoaded", async () => {
    const works = [];
    const filters = new Set(["Tous"]);

    // Fetch the works from the API
    try {
        const res = await fetch(`${API}/works`);
        const json = await res.json();
        works.push(...json);
    } catch {
        alert("Une erreur est survenue lors du chargement des projets.");
        return;
    }

    works.forEach((work) => {
        filters.add(work.category.name);
    });

    // Render the content
    render(works, filters);
});
