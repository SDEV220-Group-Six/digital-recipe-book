console.log("scripts.js is loaded"); // Debugging

// Homepage function to resize image mappings correctly
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

// Ingredients form functions
document.addEventListener("DOMContentLoaded", function () {
    console.log("scripts.js is loaded"); // Debugging

    if (document.title === "Ingredients") {
        console.log("Ingredients page loaded"); // Debugging

        const form = document.querySelector(".left-section-input-form form");
        const ingredientsList = document.getElementById("ingredients-list");
        const uploadArea = document.getElementById("upload-area");
        const fileInput = document.getElementById("image-upload");
        const nameInput = document.getElementById("name");
        const categoryInput = document.getElementById("category");
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

        // Image upload functionality
        uploadArea.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            const previewImage = document.getElementById("preview-image");

            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        previewImage.src = e.target.result;
                        uploadArea.querySelector("span").style.display = "none";
                        previewImage.style.display = "block";
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                // Hide the preview image if no file is selected
                previewImage.style.display = "none";
                uploadArea.querySelector("span").style.display = "block";
            }
        });

        // Form submission to add ingredient
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append("name", nameInput.value);
            formData.append("category", categoryInput.value);
            if (fileInput.files.length > 0) {
                formData.append("image", fileInput.files[0]);
            }

            fetch("/recipes/api/ingredients/", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to add ingredient");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Ingredient added:", data);

                    // Remove "No saved ingredients" message
                    const noIngredientsMessage = ingredientsList.querySelector(".no-ingredients");
                    if (noIngredientsMessage) {
                        noIngredientsMessage.remove();
                    }

                    // Add the new ingredient to the list
                    const newItem = document.createElement("li");
                    newItem.setAttribute("ingredient-id", data.id);
                    newItem.innerHTML = `
                        <span>${data.name} (${data.category})</span>
                        <button class="delete-ingredient" ingredient-id="${data.id}">Remove</button>
                    `;
                    ingredientsList.appendChild(newItem);

                    // Clear form
                    form.reset();
                    uploadArea.style.backgroundImage = "none";
                    uploadArea.querySelector("span").style.display = "block";

                    //Clear the image preview
                    const previewImage = document.getElementById("preview-image");
                    previewImage.src = "";
                    previewImage.style.display = "none";
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to add ingredient.");
                });
        });

        // Listen for clicks on ingredient list items or corresponding delete button
        ingredientsList.addEventListener("click", function (e) {
            if (e.target.classList.contains("delete-ingredient")) {
                const ingredientId = e.target.getAttribute("ingredient-id");
                const listItem = e.target.closest("li");
                console.log("clicked")
                deleteIngredient(ingredientId, listItem);
            } else {
                const clickedListItem = e.target.closest("li");
                if (clickedListItem && clickedListItem.hasAttribute("ingredient-id")) {
                    const ingredientId = clickedListItem.getAttribute("ingredient-id");
                    console.log("Clicked item ID:", ingredientId);
                    populateFormForEditing(ingredientId);
                } else {
                    console.log("Ingredient list is empty");
                }
            }
        });

        function deleteIngredient(ingredientId, listItem) {
            fetch(`/recipes/api/ingredients/${ingredientId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to delete ingredient");
                    }
                    ingredientsList.removeChild(listItem);

                    if (!ingredientsList.children.length) {
                        ingredientsList.innerHTML = '<li class="no-ingredients">No saved ingredients</li>';
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to delete ingredient.");
                });
        }
        function populateFormForEditing(ingredientId) {
            const previewImage = document.getElementById("preview-image");

            fetch(`/recipes/api/ingredients/${ingredientId}/`, {
                method: "GET",
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch ingredient details");
                    }
                    return response.json();
                })
                .then((data) => {
                    nameInput.value = data.name;
                    categoryInput.value = data.category;

                    if (data.image) {
                        previewImage.src = data.image;
                        uploadArea.querySelector("span").style.display = "none";
                        previewImage.style.display = "block";
                    } else {
                        previewImage.src = "";
                        previewImage.style.display = "none";
                        uploadArea.querySelector("span").style.display = "block";
                    }

                    // Highlight the selected ingredient
                    document
                        .querySelectorAll("#ingredients-list li")
                        .forEach((li) => li.classList.remove("active"));
                    document
                        .querySelector(`#ingredients-list li[ingredient-id="${ingredientId}"]`)
                        .classList.add("active");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Failed to load ingredient details.");
                });
        }
    }
});


// Function to set active class on nav item
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

