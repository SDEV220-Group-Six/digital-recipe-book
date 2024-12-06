from django.urls import path
from . import views

urlpatterns = [
    path("shop/", views.shopping_lists, name="shopping_lists"),
    path("shop/<int:list_id>/toggle-active/", views.toggle_active_list, name="toggle_active_list"),
    path("shop/add-recipe-ingredients/", views.add_to_active_list, name="add_to_active_list"),
    path("shop/<int:list_id>/ingredients/", views.shopping_list_ingredients, name="shopping_list_ingredients"),
]
