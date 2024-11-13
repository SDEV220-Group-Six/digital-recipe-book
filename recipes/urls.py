from django.urls import path
from . import views

urlpatterns = [
    path("home.html", views.home, name="home"),
    path("ingredients.html", views.ingredients, name="ingredients"),
    path("recipes.html", views.recipes, name="recipes"),
    path("shopping_list.html", views.shopping_list, name="shopping_list")
]
