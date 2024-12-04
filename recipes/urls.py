from django.urls import path
from . import views

urlpatterns = [
    # Homepage
    path("", views.home, name="home"),
    # Ingredients Page using REST
    path("ingredients/", views.ingredients, name="ingredients"),
    path("api/ingredients/", views.IngredientListView.as_view(), name="api-ingredient-list"),
    path("api/ingredients/<int:pk>/", views.IngredientDetailView.as_view(), name="api-ingredient-detail"),
    # Recipes Page using Django Forms
    path("recipes/", views.recipes, name="recipes"),
    path("recipes/<int:recipe_id>/", views.recipe_detail, name="recipe_detail"),
    path("recipes/create/", views.recipe_create, name="recipe_create"),
    path("recipes/<int:recipe_id>/edit/", views.recipe_edit, name="recipe_edit"),
    path("recipes/<int:recipe_id>/add-ingredient/", views.add_ingredient_to_recipe, name="add_ingredient_to_recipe"),
    # Shopping List Page
    path("shopping-list/", views.shopping_list, name="shopping-list"),
]
