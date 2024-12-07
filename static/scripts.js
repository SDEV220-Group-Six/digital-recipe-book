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

document.addEventListener("DOMContentLoaded", function () {
    console.log("scripts.js is loaded"); // Debugging

    // Ingredients form functions
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

        async function isDuplicateIngredient(name, ingredientId = null) {
            try {
                const response = await fetch("/recipebook/api/ingredients/");
                if (!response.ok) {
                    throw new Error("Failed to fetch ingredients.");
                }

                const ingredients = await response.json();

                // Check for duplicates and exclude the current ingredient ID
                return ingredients.some(
                    (ingredient) =>
                        ingredient.name.toLowerCase() === name.toLowerCase() &&
                        ingredient.id !== parseInt(ingredientId)
                );
            } catch (error) {
                console.error("Error checking duplicate ingredient:", error);
                return false;
            }
        }

        // Form submission to add ingredient
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const ingredientName = nameInput.value.trim();
            const ingredientId = document.getElementById("ingredient-id").value;

            const isDuplicate = await isDuplicateIngredient(ingredientName, ingredientId);
            if (isDuplicate) {
                alert("An ingredient with this name already exists! Please choose a different name.");
                return;
            }

            const formData = new FormData();
            formData.append("name", nameInput.value);
            formData.append("category", categoryInput.value);
            if (fileInput.files.length > 0) {
                formData.append("image", fileInput.files[0]);
            }

            // check if editing or creating ingredient
            const url = ingredientId
                ? `/recipebook/api/ingredients/${ingredientId}/`
                : "/recipebook/api/ingredients/";
            const method = ingredientId ? "PUT" : "POST";

            fetch(url, {
                method: method,
                body: formData,
                headers: {
                    "X-CSRFToken": csrfToken,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to ${method === "PUT" ? "update" : "create"} ingredient`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Ingredient saved:", data);

                    // Remove "No saved ingredients" message
                    const noIngredientsMessage = ingredientsList.querySelector(".no-ingredients");
                    if (noIngredientsMessage) {
                        noIngredientsMessage.remove();
                    }

                    // Add the new ingredient to the list
                    let existingItem = ingredientsList.querySelector(`li[ingredient-id="${data.id}"]`);
                    if (existingItem) {
                        // Update the existing ingredient in the list
                        existingItem.innerHTML = `
                    <span>${data.name} (${data.category})</span>
                    <button class="delete-ingredient" ingredient-id="${data.id}">Remove</button>
                `;
                    } else {
                        // Add the new ingredient to the list
                        const newItem = document.createElement("li");
                        newItem.setAttribute("ingredient-id", data.id);
                        newItem.innerHTML = `
                    <span>${data.name} (${data.category})</span>
                    <button class="delete-ingredient" ingredient-id="${data.id}">Remove</button>
                `;
                        ingredientsList.appendChild(newItem);
                    }

                    // Clear form
                    form.reset();
                    document.getElementById("ingredient-id").value = "";
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
            fetch(`/recipebook/api/ingredients/${ingredientId}/`, {
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

                    // If the deleted ingredient was selected, clear the form
                    const currentIngredientId = document.getElementById("ingredient-id").value;
                    if (currentIngredientId === ingredientId) {
                        clearForm();
                    }

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

            fetch(`/recipebook/api/ingredients/${ingredientId}/`, {
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
                    document.getElementById("ingredient-id").value = data.id;

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

        // Function to clear the form fields
        function clearForm() {
            nameInput.value = ""; // Clear name field
            categoryInput.value = ""; // Clear category dropdown
            fileInput.value = ""; // Clear file input
            document.getElementById("ingredient-id").value = ""; // Clear hidden ingredient ID

            // Clear the image preview
            const previewImage = document.getElementById("preview-image");
            previewImage.src = "";
            previewImage.style.display = "none";

            // Restore the upload area placeholder
            uploadArea.querySelector("span").style.display = "block";

            // Remove active state from any selected list item
            document.querySelectorAll("#ingredients-list li").forEach((li) => li.classList.remove("active"));
        }
    }

    // Recipes list functions
    if (document.title === "Recipes") {
        console.log("Recipes page loaded"); // Debugging

        const removeRecipeItemButtons = document.querySelectorAll(".delete-ingredient")
        console.log(removeRecipeItemButtons)
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

        // Add click event listener to each "Remove" button
        removeRecipeItemButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                event.preventDefault();

                const recipeId = button.getAttribute("recipe-id");
                console.log(`Attempting to remove recipe with ID: ${recipeId}`);

                const listItem = button.closest("li");
                const recipesList = document.getElementById("recipes-list");

                fetch(`/recipebook/recipes/${recipeId}/delete/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log(`Recipe with ID: ${recipeId} deleted successfully`);
                            listItem.remove();

                            if (!recipesList.children.length) {
                                recipesList.innerHTML = '<li class="no-ingredients">No saved recipes</li>';
                            }
                        } else {
                            console.error("Failed to delete recipe:", response.statusText);
                            alert("Failed to delete the recipe. Please try again.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("An error occurred while deleting the recipe.");
                    });
            });
        });

        // Add click event listener for "Add to Shopping List" buttons
        document.querySelectorAll(".add-to-shopping-list").forEach(icon => {
            icon.addEventListener("click", function (event) {
                event.preventDefault();

                const recipeId = this.dataset.recipeId;
                console.log(`Adding ingredients of recipe ID: ${recipeId} to active shopping list`);

                fetch("/recipebook/shop/add-recipe-ingredients/", {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipe_id: recipeId }),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error(data.error);
                            alert("Failed to add ingredients to shopping list: " + data.error);
                        } else {
                            console.log(data.message);
                            alert(data.message);
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("An error occurred while adding ingredients to the shopping list.");
                    });
            });
        });
    }
    // Recipe Details functions
    if (document.title === "Recipe Details") {
        console.log("Recipe Details page loaded");

        const removeRecipeItemButtons = document.querySelectorAll(".delete-ingredient");
        console.log(removeRecipeItemButtons);
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
        const recipeId = document.getElementById("ingredients-list").getAttribute("data-recipe-id");

        removeRecipeItemButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                event.preventDefault();

                const listItem = button.closest("li");
                const ingredientId = listItem.getAttribute("ingredient-id");
                console.log(`Attempting to remove ingredient with ID: ${ingredientId}`);

                const ingredientsList = document.getElementById("ingredients-list");

                fetch(`/recipebook/recipes/${recipeId}/ingredients/${ingredientId}/delete/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrfToken,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            console.log(`Ingredient with ID: ${ingredientId} deleted successfully`);
                            listItem.remove();

                            if (!ingredientsList.children.length) {
                                ingredientsList.innerHTML = '<li class="no-ingredients">No ingredients added to this recipe</li>';
                            }
                        } else {
                            console.error("Failed to delete ingredient:", response.statusText);
                            alert("Failed to delete the ingredient. Please try again.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("An error occurred while deleting the ingredient.");
                    });
            });
        });
    }

    //Shopping List functions
    if (document.title === "Shopping List") {
        console.log("Shopping List page loaded");

        const ingredientsList = document.getElementById("ingredients-list");

        if (!ingredientsList) {
            console.error("ingredientsList element not found in the DOM.");
            return;
        }

        document.querySelectorAll(".toggle-icon").forEach(icon => {
            icon.addEventListener("click", function (event) {
                event.stopPropagation();

                const listId = this.dataset.listId;
                const isActive = this.src.includes("toggle-on.svg");

                if (isActive) {
                    console.log(`List ID ${listId} is already active.`);
                    return;
                }

                fetch(`/recipebook/shop/${listId}/toggle-active/`, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);

                        document.querySelectorAll(".shopping-list").forEach(list => {
                            list.classList.remove("active");
                            const icon = list.querySelector(".toggle-icon");
                            if (icon) {
                                icon.src = "/static/images/toggle-off.svg";
                                icon.alt = "Inactive";
                            }
                        });

                        this.closest(".shopping-list").classList.add("active");
                        this.src = "/static/images/toggle-on.svg";
                        this.alt = "Active";
                    })
                    .catch(error => console.error("Error:", error));
            });
        });

        document.querySelectorAll(".shopping-list li").forEach(item => {
            item.addEventListener("click", function () {
                const listId = this.dataset.listId;

                if (!listId) {
                    console.error("List ID is undefined for this shopping list item.");
                    return;
                }

                console.log(`Fetching ingredients for shopping list ID: ${listId}`);

                fetch(`/recipebook/shop/${listId}/ingredients/`, {
                    method: "GET",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            console.error(data.error);
                            ingredientsList.innerHTML = `<li class="no-ingredients">${data.error}</li>`;
                        } else {
                            ingredientsList.innerHTML = "";

                            if (data.ingredients.length === 0) {
                                ingredientsList.innerHTML = `<li class="no-ingredients">No ingredients in this shopping list.</li>`;
                            } else {
                                data.ingredients.forEach(ingredient => {
                                    const li = document.createElement("li");
                                    li.textContent = `${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}`;
                                    ingredientsList.appendChild(li);
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching ingredients:", error);
                        ingredientsList.innerHTML = `<li class="no-ingredients">Error loading ingredients. Please try again.</li>`;
                    });
            });
        });

        // Remove shopping list
        document.querySelectorAll(".delete-ingredient").forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation();

                const listId = this.dataset.listId;

                if (!listId) {
                    console.error("List ID is undefined for this shopping list item.");
                    return;
                }

                console.log(`Attempting to remove shopping list with ID: ${listId}`);

                fetch(`/recipebook/shop/${listId}/delete/`, {
                    method: "DELETE",
                    headers: {
                        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            console.log(`Shopping list with ID ${listId} removed successfully.`);
                            this.closest("li").remove();

                            const shoppingListContainer = document.querySelector("#shopping-lists ul");
                            if (!shoppingListContainer.children.length) {
                                shoppingListContainer.innerHTML = `<li class="no-ingredients">No shopping lists available.</li>`;
                            }
                        } else {
                            console.error("Failed to remove shopping list:", response.statusText);
                            alert("Failed to remove the shopping list. Please try again.");
                        }
                    })
                    .catch(error => {
                        console.error("Error removing shopping list:", error);
                        alert("An error occurred while removing the shopping list.");
                    });
            });
        });
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

