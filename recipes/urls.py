from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("ingredients/", views.ingredients, name="ingredients"),
    path("api/ingredients/", views.IngredientListView.as_view(), name="api-ingredient-list"),
    path("api/ingredients/<int:pk>/", views.IngredientDetailView.as_view(), name="api-ingredient-detail"),
    path("recipes/", views.recipes, name="recipes"),
    path("recipe_detail/", views.recipe_detail, name="recipe_detail"),
    path("shopping-list/", views.shopping_list, name="shopping-list"),
]