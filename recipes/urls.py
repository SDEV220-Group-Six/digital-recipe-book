from django.urls import path
from . import views

urlpatterns = [
    path("home.html", views.home, name="home"),
    path("ingredients.html", views.ingredients, name="ingredients"),
    path("recipes.html", views.recipes, name="recipes"),
    path("shopping_list.html", views.shopping_list, name="shopping_list"),
    path("ingredients/list/", views.get_ingredients_list, name="ingredients_list"),
    path("delete_ingredient/<int:ingredient_id>/", views.delete_ingredient, name="delete_ingredient"),
    path("get_ingredient/<int:ingredient_id>/", views.get_ingredient, name="get_ingredient"),
]
