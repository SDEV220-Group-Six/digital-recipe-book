// function to resize image mappings correctly
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

// triggers logout form submit action
function logout() {
    document.getElementById("logout-form").submit();
}

