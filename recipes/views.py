from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def home(request):
    return render(request, "recipes/base.html")

@login_required
def ingredients(request):
    return render(request, "recipes/ingredients.html")

@login_required
def recipes(request):
    return render(request, "recipes/recipes.html")

@login_required
def shopping_list(request):
    return render(request, "recipes/shopping_list.html")
