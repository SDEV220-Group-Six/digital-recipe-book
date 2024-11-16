from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Ingredient

# Create your views here.


@login_required
def home(request):
    return render(request, "recipes/homepage.html")


# @login_required
# def ingredients(request):
#     return render(request, "recipes/ingredients.html")


@login_required
def ingredients(request):
    if request.method == "POST":
        print("POST request received")  # Debugging
        print("POST data:", request.POST)  # Debugging
        print("FILES data:", request.FILES)  # Debugging
        print("POST request received")
        # Handle adding a new ingredient
        name = request.POST.get("name")
        category = request.POST.get("category")
        image = request.FILES.get("image", None)

        # Validate input
        if not name or not category:
            return JsonResponse(
                {"error": "Name and category are required."}, status=400
            )

        if category not in dict(Ingredient.CATEGORY_CHOICES):
            return JsonResponse({"error": "Invalid category."}, status=400)

        # Create and save the new ingredient
        ingredient = Ingredient.objects.create(
            name=name, category=category, image=image, created_by=request.user
        )
        return JsonResponse(
            {
                "id": ingredient.id,
                "name": ingredient.name,
                "category": dict(Ingredient.CATEGORY_CHOICES).get(ingredient.category),
                "image_url": ingredient.image.url if ingredient.image else None,
            }
        )

    # Handle GET requests: Load saved ingredients and category choices
    category_choices = Ingredient.CATEGORY_CHOICES
    ingredients = Ingredient.objects.filter(created_by=request.user)
    return render(
        request,
        "recipes/ingredients.html",
        {"category_choices": category_choices, "ingredients": ingredients},
    )


@login_required
def get_ingredients_list(request):
    # Query all ingredients created by the current user
    ingredients = Ingredient.objects.filter(created_by=request.user)
    ingredients_data = [
        {
            "id": ingredient.id,
            "name": ingredient.name,
            "category": ingredient.category,
            "image_url": ingredient.image.url if ingredient.image else "",
        }
        for ingredient in ingredients
    ]
    return JsonResponse({"ingredients": ingredients_data})


@csrf_exempt
@login_required
def delete_ingredient(request, ingredient_id):
    try:
        ingredient = Ingredient.objects.get(id=ingredient_id, created_by=request.user)
        ingredient.delete()
        return JsonResponse({"success": True})
    except Ingredient.DoesNotExist:
        return JsonResponse({"error": "Ingredient not found."}, status=404)


@login_required
def get_ingredient(request, ingredient_id):
    try:
        ingredient = Ingredient.objects.get(id=ingredient_id, created_by=request.user)
        return JsonResponse(
            {
                "id": ingredient.id,
                "name": ingredient.name,
                "category": ingredient.category,
                "image_url": ingredient.image.url if ingredient.image else None,
            }
        )
    except Ingredient.DoesNotExist:
        return JsonResponse({"error": "Ingredient not found."}, status=404)


@login_required
def recipes(request):
    return render(request, "recipes/recipes.html")


@login_required
def shopping_list(request):
    return render(request, "recipes/shopping_list.html")
