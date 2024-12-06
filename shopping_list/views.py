import json
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import ShoppingList, ShoppingListItem
from recipes.models import Recipe

# Create your views here.


@login_required
def shopping_lists(request):
    lists = ShoppingList.objects.filter(created_by=request.user)
    active_list = lists.filter(active=True).first()
    return render(
        request,
        "shopping_list/shopping_lists.html",
        {"lists": lists, "active_list": active_list},
    )
    
@login_required
def delete_shopping_list(request, list_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    shopping_list = get_object_or_404(ShoppingList, id=list_id, created_by=request.user)
    shopping_list.delete()
    return JsonResponse({"message": "Shopping list deleted successfully."}, status=204)


@login_required
def toggle_active_list(request, list_id):
    shopping_list = get_object_or_404(ShoppingList, id=list_id, created_by=request.user)

    ShoppingList.objects.filter(created_by=request.user).update(active=False)

    shopping_list.active = True
    shopping_list.save()

    return JsonResponse({"message": f"{shopping_list.name} is now the active list."})


@login_required
def add_to_active_list(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method."}, status=405)

    try:
        body = json.loads(request.body)
        recipe_id = body.get("recipe_id")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    if not recipe_id:
        return JsonResponse({"error": "Recipe ID is required."}, status=400)

    active_list = ShoppingList.objects.filter(
        created_by=request.user, active=True
    ).first()
    if not active_list:
        return JsonResponse({"error": "No active shopping list found."}, status=400)

    recipe = get_object_or_404(Recipe, id=recipe_id, created_by=request.user)

    for recipe_ingredient in recipe.get_ingredients():
        ShoppingListItem.objects.create(
            shopping_list=active_list,
            recipe_ingredient=recipe_ingredient,
        )

    return JsonResponse(
        {
            "message": f"Ingredients from {recipe.name} added to the active shopping list."
        }
    )


@login_required
def shopping_list_ingredients(request, list_id):
    shopping_list = get_object_or_404(ShoppingList, id=list_id, created_by=request.user)
    ingredients = shopping_list.items.select_related("recipe_ingredient").all()

    if not ingredients:
        return JsonResponse({"ingredients": []})

    ingredients_data = [
        {
            "name": item.recipe_ingredient.ingredient.name,
            "quantity": item.recipe_ingredient.quantity,
            "unit": item.recipe_ingredient.unit,
        }
        for item in ingredients
    ]

    return JsonResponse({"ingredients": ingredients_data})
