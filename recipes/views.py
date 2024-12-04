from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db import models
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Ingredient, Recipe, RecipeIngredient
from .forms import RecipeForm, RecipeIngredientForm
from .serializers import IngredientSerializer

# Create your views here.


@login_required
def home(request):
    return render(request, "recipes/homepage.html")


@login_required
def ingredients(request):
    ingredients = Ingredient.objects.filter(created_by=request.user)
    ingredients = ingredients.annotate(
        is_used=models.Exists(
            RecipeIngredient.objects.filter(ingredient_id=models.OuterRef("id"))
        )
    )
    serialized_ingredients = IngredientSerializer(ingredients, many=True).data
    return render(
        request,
        "recipes/ingredients.html",
        {
            "category_choices": Ingredient.CATEGORY_CHOICES,
            "ingredients": serialized_ingredients,
        },
    )


@login_required
def recipes(request):
    recipes = Recipe.objects.filter(created_by=request.user)
    return render(request, "recipes/recipe_list.html", {"recipes": recipes})


@login_required
def recipe_detail(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id, created_by=request.user)
    ingredients = recipe.get_ingredients()
    return render(
        request,
        "recipes/recipe_detail.html",
        {"recipe": recipe, "ingredients": ingredients},
    )


@login_required
def recipe_create(request):
    if request.method == "POST":
        form = RecipeForm(request.POST, request.FILES)
        if form.is_valid():
            recipe = form.save(commit=False)
            recipe.created_by = request.user
            recipe.save()
            return redirect("recipe_detail", recipe_id=recipe.id)
    else:
        form = RecipeForm()

    return render(request, "recipes/recipe_form.html", {"form": form})


@login_required
def recipe_edit(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id, created_by=request.user)
    if request.method == "POST":
        form = RecipeForm(request.POST, request.FILES, instance=recipe)
        if form.is_valid():
            form.save()
            return redirect("recipe_detail", recipe_id=recipe.id)
    else:
        form = RecipeForm(instance=recipe)

    return render(request, "recipes/recipe_form.html", {"form": form})


@login_required
def add_ingredient_to_recipe(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id, created_by=request.user)
    if request.method == "POST":
        form = RecipeIngredientForm(request.POST, user=request.user)
        if form.is_valid():
            recipe_ingredient = form.save(commit=False)
            recipe_ingredient.recipe = recipe
            recipe_ingredient.save()
            if "add_and_continue" in request.POST:
                return render(
                    request,
                    "recipes/add_ingredient_form.html",
                    {"form": RecipeIngredientForm(user=request.user), "recipe": recipe},
                )
            else:
                return redirect("recipe_detail", recipe_id=recipe.id)
    else:
        form = RecipeIngredientForm(user=request.user)

    return render(
        request, "recipes/add_ingredient_form.html", {"form": form, "recipe": recipe}
    )


@login_required
def recipe_delete(request, recipe_id):
    if request.method == "POST":
        try:
            recipe = Recipe.objects.get(id=recipe_id, created_by=request.user)
            recipe.delete()
            return JsonResponse({"message": "Recipe deleted successfully"}, status=204)
        except Recipe.DoesNotExist:
            return JsonResponse({"error": "Recipe not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)


@login_required
def shopping_list(request):
    return render(request, "recipes/shopping_list.html")


class IngredientListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ingredients = Ingredient.objects.filter(created_by=request.user)
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IngredientDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            ingredient = Ingredient.objects.get(pk=pk, created_by=request.user)
            serializer = IngredientSerializer(ingredient)
            return Response(serializer.data)
        except Ingredient.DoesNotExist:
            return Response(
                {"error": "Ingredient not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        try:
            ingredient = Ingredient.objects.get(pk=pk, created_by=request.user)
            ingredient.delete()
            return Response(
                {"message": "Ingredient deleted"}, status=status.HTTP_204_NO_CONTENT
            )
        except Ingredient.DoesNotExist:
            return Response(
                {"error": "Ingredient not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        try:
            ingredient = Ingredient.objects.get(pk=pk, created_by=request.user)
            serializer = IngredientSerializer(
                ingredient, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Ingredient.DoesNotExist:
            return Response(
                {"error": "Ingredient not found"}, status=status.HTTP_404_NOT_FOUND
            )
