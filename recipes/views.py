from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Ingredient
from .serializers import IngredientSerializer

# Create your views here.


@login_required
def home(request):
    return render(request, "recipes/homepage.html")


@login_required
def ingredients(request):
    ingredients = Ingredient.objects.filter(created_by=request.user)
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
    return render(request, "recipes/recipes.html")


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
