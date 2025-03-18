document.addEventListener("DOMContentLoaded", () => {
  let addPlant = false;

  const addBtn = document.querySelector("#submit-btn");
  const plantFormContainer = document.querySelector(".container");
  const form = document.querySelector('#new-plant');
  
  addBtn.addEventListener("click", () => {
    addPlant = !addPlant;
    if (addPlant) {
      plantFormContainer.style.display = "block";
    } else {
      plantFormContainer.style.display = "none";
    }
  });
  
  function renderPlants(plants) {
    const main = document.querySelector("#garden");
    main.innerHTML = "";
     plants.forEach(renderPlant)
     console.log("Plants are Rendered!")
  }
  
  function renderPlant(plant) {
    const main = document.querySelector("#garden")
     const thePlant = document.createElement("div");
      thePlant.className = "card";
      thePlant.id = `plant-${plant.id}`;

      const plantName = document.createElement("h2");
      plantName.textContent = plant.name;

      const plantImg = document.createElement("img");
      plantImg.src = plant.image;
      plantImg.style.width = `200px`;

      const plantWater = document.createElement("h3");
      plantWater.textContent = `Did I get Watered?: ${plant.water}`;

      const waterButton = document.createElement("button");
      waterButton.className = "water-btn";
      waterButton.id = plant.id;
      waterButton.textContent = "Water! 💧";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.id = plant.id;
      deleteButton.textContent = "Dig Up! ⛏️";

      thePlant.appendChild(plantName);
      thePlant.appendChild(plantImg);
      thePlant.appendChild(plantWater);
      thePlant.appendChild(waterButton);
      thePlant.appendChild(deleteButton);
      main.appendChild(thePlant);

      waterButton.addEventListener("click", () => {
        if (plant.water === "No") {
          updateWater(plant.id, "Yes");
          plantWater.textContent = `Did I get Watered?: Yes`;
          plant.water = "Yes"; 
         }
      });
      deleteButton.addEventListener("click", () => {
        deletePlant(plant.id);
      });
      
  }

  function updateWater(plantId, newWater) {
    fetch(`http://localhost:3000/plants/${plantId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        water: newWater,
      }),
    })
      .then((response) => response.json())
      .then((updatedPlant) => {
        console.log("Plant updated:", updatedPlant);
      })
      .catch((error) => {
        console.error("Error updating Plant:", error);
      });
  }

  function deletePlant(plantId){
    fetch( `http://localhost:3000/plants/${plantId}`, {
      method: "DELETE",
    })
    .then(()=> {
      console.log(`Plant ${plantId} dug up`);
      document.querySelector(`#plant-${plantId}`).remove();
    })
    .catch((error) => {
      console.error("Error digging up Plant:", error);
    });
  }

 
  form.addEventListener('submit', handleFormSubmit);
  
  function handleFormSubmit(event){
    event.preventDefault();
    const nameInput = document.querySelector('#new-name').value;
    const imageInput = document.querySelector('#new-image').value;

    fetch('http://localhost:3000/plants', {
      method: "POST",
      headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: nameInput,
        image: imageInput,
        water: "No",
      })
    })
    .then(response => response.json())
    .then(newPlant => {
      renderPlant(newPlant); 
    })
    .catch(error => {
      console.error('Error adding Plant:', error);
    });
  }

  function fetchPlants() {
    fetch("http://localhost:3000/plants")
      .then((resp) => resp.json())
      .then((data) => {
        renderPlants(data);
      })
      .catch((error) => {
        console.error("Error fetching plants:", error);
      });
  }

  fetchPlants();
});
