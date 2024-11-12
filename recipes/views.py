from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, "recipes/base.html")


def ingredients(request):
    return render(request, "recipes/ingredients.html")


def recipes(request):
    return render(request, "recipes/recipes.html")


def shopping_list(request):
    return render(request, "recipes/shopping_list.html")
