const gardenData = {
  API_KEY: "J7FFOH9ICPoi0kJoi1MmSeKpb99fKgCcol9j3capCZcs7lks94tPvRz9",
  page: 1,
  async getData() {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=flowers&per_page=10&page=${this.page}`,
      {
        method: "GET",
        headers: {
          Authorization: this.API_KEY,
        },
      }
    );
    const data = await response.json();
    return data.photos;
  },
  setPage(newPage) {
    this.page = newPage;
  },
};

const UI = {
  loadSelectors() {
    const container = document.querySelector(".grid-container");
    const firstBtn = document.getElementById("first");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const lastBtn = document.getElementById("last");
    const allBtn = document.getElementsByClassName("all-button")[0];

    return { container, firstBtn, prevBtn, nextBtn, lastBtn, allBtn };
  },

  async getData() {
    const data = await gardenData.getData();
    return data;
  },

  populateUI(data) {
    const { container } = this.loadSelectors();
    container.innerHTML = ""; // Clear the container before appending new items

    data.forEach((plant) => {
      const plantDiv = document.createElement("div");
      plantDiv.classList.add("grid-item");
      plantDiv.innerHTML = `
        <p>${plant.alt}</p>
        <img src="${plant.src.medium}" alt="${plant.alt}" />
      `;
      container.appendChild(plantDiv);
    });
  },

  async loadPage(page) {
    // Show loading message
    const loadingMessage = document.querySelector(".loading");
    loadingMessage.style.display = "block";
    // Set the page
    gardenData.setPage(page);
    // Feth data for given page
    const data = await this.getData();

    this.populateUI(data);

    loadingMessage.style.display = "none";
  },

  pagination() {
    const { firstBtn, prevBtn, nextBtn, lastBtn, allBtn } =
      this.loadSelectors();

    // Go to the first page
    firstBtn.addEventListener("click", async () => {
      await this.loadPage(1);
    });

    // Go to the last page
    lastBtn.addEventListener("click", async () => {
      await this.loadPage(10);
    });

    // Go to the previous page
    prevBtn.addEventListener("click", async () => {
      if (gardenData.page > 1) {
        await this.loadPage(gardenData.page - 1);
      }
    });

    // Go to the next page
    nextBtn.addEventListener("click", async () => {
      if (gardenData.page < 10) {
        await this.loadPage(gardenData.page + 1);
      }
    });

    // Load all flowers from all 10 pages
    allBtn.addEventListener("click", async () => {
      const allPhotos = [];
      for (let i = 1; i <= 10; i++) {
        gardenData.setPage(i); // Set & set page FOR 10 TIMES
        const data = await this.getData(); // Fetch data for the current page
        allPhotos.push(...data);
      }
      this.populateUI(allPhotos); // Populate all flowers from 10 pages
    });
  },

  async init() {
    // Load the page so don't have to call populateUI
    await this.loadPage(gardenData.page);
    this.pagination();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  UI.init();
});
