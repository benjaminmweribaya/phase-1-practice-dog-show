document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("table-body");
    const dogForm = document.getElementById("dog-form");
    let selectedDog = null;

    // Fetch and display all registered dogs
    function fetchDogs() {
        fetch("http://localhost:3000/dogs")
            .then(response => response.json())
            .then(dogs => renderDogs(dogs))
            .catch(error => console.error("Error fetching dogs:", error));
    }

    // Render dogs in the table
    function renderDogs(dogs) {
        tableBody.innerHTML = ""; // Clear existing rows
        dogs.forEach(dog => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button data-id="${dog.id}" class="edit-btn">Edit</button></td>
        `;
            tableBody.appendChild(tr);
        });
    }

    // Populate the form with the selected dog's data
    function populateForm(dog) {
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
        selectedDog = dog;
    }

    // Handle form submission for editing a dog
    dogForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (selectedDog) {
            const updatedDog = {
                name: dogForm.name.value,
                breed: dogForm.breed.value,
                sex: dogForm.sex.value
            };

            // Update the dog info on the server with PATCH request
            fetch(`http://localhost:3000/dogs/${selectedDog.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedDog)
            })
                .then(response => response.json())
                .then(() => {
                    fetchDogs(); // Refresh the dog list after the update
                    dogForm.reset(); // Clear the form
                    selectedDog = null; // Reset selected dog
                })
                .catch(error => console.error("Error updating dog:", error));
        }
    });

    // Add event listener to table for edit buttons
    tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const dogId = event.target.dataset.id;

            // Fetch the selected dog's details to populate the form
            fetch(`http://localhost:3000/dogs/${dogId}`)
                .then(response => response.json())
                .then(dog => populateForm(dog))
                .catch(error => console.error("Error fetching dog details:", error));
        }
    });

    // Initial fetch of dog data
    fetchDogs();
});
