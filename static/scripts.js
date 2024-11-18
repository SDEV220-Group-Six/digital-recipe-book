console.log("scripts.js is loaded"); // Debugging

// homepage function to resize image mappings correctly
if (document.title === "Home") {
    document.addEventListener("DOMContentLoaded", function () {
        const img = document.getElementById("recipe-image");
        const map = document.querySelector("map[name='recipe-map']");
        const originalWidth = 853; // original width of the .svg

        function resizeImageMap() {
            const scale = img.clientWidth / originalWidth;
            for (const area of map.areas) {
                const coords = area.getAttribute("data-original-coords").split(",").map(Number);
                const newCoords = coords.map(coord => Math.round(coord * scale)).join(",");
                area.setAttribute("coords", newCoords);
            }
        }

        // saves original coordinates in data attributes
        for (const area of map.areas) {
            area.setAttribute("data-original-coords", area.getAttribute("coords"));
        }

        // resizes the image map on load and on window resize
        resizeImageMap();
        window.addEventListener("resize", resizeImageMap);

        // enforce resize on image load, ensuring correct initial placement
        img.addEventListener("load", resizeImageMap);
    });
}

// ingredients form functions
if (document.title === "Ingredients") {
    document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM fully loaded and parsed"); // Debugging

        const uploadArea = document.getElementById("upload-area");
        const fileInput = document.getElementById("image-upload");
        const ingredientsList = document.getElementById("ingredients-list");
        const form = document.querySelector(".left-section-input-form form");
        if (!form) {
            console.error("Form NOT found in DOM!"); // Debugging
            return;
        }
        const nameInput = document.getElementById("name");
        const categoryInput = document.getElementById("category");
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

        // Image upload functionality
        uploadArea.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        uploadArea.style.backgroundImage = `url(${e.target.result})`;
                        uploadArea.querySelector("span").style.display = "none";
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

        uploadArea.addEventListener("dragover", function (e) {
            e.preventDefault();
            uploadArea.classList.add("dragging");
        });

        uploadArea.addEventListener("dragleave", function () {
            uploadArea.classList.remove("dragging");
        });

        uploadArea.addEventListener("drop", function (e) {
            e.preventDefault();
            uploadArea.classList.remove("dragging");

            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        uploadArea.style.backgroundImage = `url(${e.target.result})`;
                        uploadArea.querySelector("span").style.display = "none";
                    };
                    reader.readAsDataURL(file);
                    fileInput.files = e.dataTransfer.files;
                }
            }
        });

        // Submit form to add or update ingredient
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("csrfmiddlewaretoken", csrfToken);

            fetch("", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse the JSON response
                })
                .then((data) => {
                    if (data.id) {
                        // Remove "No saved ingredients" message if it exists
                        const noIngredientsMessage = document.querySelector("#ingredients-list li.no-ingredients");
                        if (noIngredientsMessage) {
                            noIngredientsMessage.remove();
                        }

                        // Add the new ingredient to the list
                        const newItem = document.createElement("li");
                        newItem.innerHTML = `
                            <span>${data.name} (${data.category})</span>
                            <button class="delete-ingredient" data-id="${data.id}">Remove</button>
                        `;

                        // Add click event to populate the form
                        newItem.addEventListener("click", () => {
                            nameInput.value = data.name;
                            categoryInput.value = data.category;
                            uploadArea.style.backgroundImage = `url(${data.image_url || ''})`;
                            uploadArea.querySelector("span").style.display = data.image_url ? "none" : "block";
                        });

                        // Add delete functionality
                        newItem.querySelector(".delete-ingredient").addEventListener("click", (e) => {
                            e.stopPropagation();
                            deleteIngredient(data.id, newItem);
                        });

                        ingredientsList.appendChild(newItem);
                        alert("Ingredient added successfully!");
                    } else {
                        alert("Error adding ingredient");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to add ingredient.");
                });
        });

        // Load saved ingredients
        fetch("/ingredients/list/")
            .then((response) => response.json())
            .then((data) => {
                if (data.ingredients.length > 0) {
                    ingredientsList.innerHTML = "";
                    data.ingredients.forEach((ingredient) => {
                        const listItem = document.createElement("li");
                        listItem.innerHTML = `
                    <span>${ingredient.name} (${ingredient.category})</span>
                    <button class="delete-ingredient" data-id="${ingredient.id}">Remove</button>
                `;

                        listItem.addEventListener("click", () => {
                            nameInput.value = ingredient.name;
                            categoryInput.value = ingredient.category;
                            uploadArea.style.backgroundImage = `url(${ingredient.image_url || ''})`;
                            uploadArea.querySelector("span").style.display = ingredient.image_url ? "none" : "block";
                        });

                        listItem.querySelector(".delete-ingredient").addEventListener("click", (e) => {
                            e.stopPropagation();
                            deleteIngredient(ingredient.id, listItem);
                        });

                        ingredientsList.appendChild(listItem);
                    });
                } else {
                    ingredientsList.innerHTML = "<li>No saved ingredients</li>";
                }
            });

        // Function to delete an ingredient
        function deleteIngredient(id, listItem) {
            fetch(`/delete_ingredient/${id}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        // Remove the item from the list
                        ingredientsList.removeChild(listItem);

                        // Check if the list is now empty
                        if (!ingredientsList.children.length) {
                            ingredientsList.innerHTML = "<li class='no-ingredients'>No saved ingredients</li>";
                        }
                    } else {
                        alert("Error deleting ingredient");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to delete ingredient.");
                });
        }
    });
}


// function to set active class on nav item
document.addEventListener("DOMContentLoaded", function () {
    const navItems = document.querySelectorAll(".nav-section .nav-item");

    navItems.forEach((item) => {
        item.addEventListener("click", function () {
            // Remove active class from all nav items
            navItems.forEach((nav) => nav.classList.remove("active"));

            // Add active class to the clicked nav item
            this.classList.add("active");
        });
    });
});

// triggers logout form submit action
function logout() {
    document.getElementById("logout-form").submit();
}

