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
    figureEl.setAttribute("data-id", work.id);

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

/**
 * Display the modal.
 */
const showModal = () => {
    if (isAuthenticated()) {
        const modal = document.getElementById("modal");
        modal.classList.add("visible");
        document.body.style.maxHeight = "100vh";
        document.body.style.overflow = "hidden";
    }
};

/**
 * Hide the modal.
 */
const hideModal = () => {
    document.getElementById("modal").classList.remove("visible");
    document.body.style.maxHeight = "";
    document.body.style.overflow = "";

    // Reset the view
    const editGallery = document.getElementById("edit-gallery");
    const addWork = document.getElementById("add-work");
    const backButton = document.querySelector(".modal-buttons .button-back");
    editGallery.style.display = "block";
    addWork.style.display = "none";
    backButton.style.display = "none";
};

const isModalVisible = () => {
    return document.getElementById("modal").classList.contains("visible");
};

const setupGalleryModal = (works) => {
    // Create the HTML for works
    const list = document.querySelector("#edit-gallery .work-list");
    const workEls = [];
    works.forEach((work, i) => {
        const li = document.createElement("li");
        li.classList.add("work-list-item");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteButton = document.createElement("button");
        const deleteImage = document.createElement("img");
        deleteImage.src = "./assets/icons/trash.svg";
        deleteButton.appendChild(deleteImage);
        deleteButton.classList.add("delete-work");

        li.appendChild(img);
        li.appendChild(deleteButton);

        li.setAttribute("data-id", work.id);

        deleteButton.addEventListener("click", () => {
            fetch(`${API}/works/${work.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    switch (res.status) {
                        case 204:
                            document
                                .querySelectorAll(`[data-id="${work.id}"]`)
                                .forEach((work) => {
                                    work.remove();
                                });

                            work.splice(i, 1);
                            break;
                        case 401:
                            alert("Erreur d'authentification.");
                            break;
                        case 500:
                            alert("Erreur du serveur.");
                            break;
                        default:
                            break;
                    }
                })
                .catch(() => {
                    alert("Une erreur est survenue.");
                });
        });

        workEls.push(li);
    });
    list.append(...workEls);

    // Back button
    const backButton = document.querySelector(".modal-buttons .button-back");
    backButton.addEventListener("click", () => {
        const editGallery = document.getElementById("edit-gallery");
        const addWork = document.getElementById("add-work");

        editGallery.style.display = "block";
        addWork.style.display = "none";
        backButton.style.display = "none";
    });

    // Add work button
    const addWorkButton = document.querySelector(".open-add-work");
    addWorkButton.addEventListener("click", () => {
        const editGallery = document.getElementById("edit-gallery");
        const addWork = document.getElementById("add-work");

        editGallery.style.display = "none";
        addWork.style.display = "block";
        backButton.style.display = "block";
    });
};

/**
 * Set up the modal events
 */
const setupModal = () => {
    modal.addEventListener("click", () => {
        hideModal();
    });

    const content = modal.querySelector(".modal-content");
    content.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    const closeButton = modal.querySelector(".button-close");
    closeButton.addEventListener("click", () => {
        hideModal();
    });
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

    // Edit work
    const editButton = document.querySelector(".edit-button");

    setupModal();
    setupGalleryModal(works);
    editButton.addEventListener("click", () => {
        if (isAuthenticated()) {
            // Open modal
            showModal();
        }
    });
});
