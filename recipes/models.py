from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.


class Ingredient(models.Model):
    CATEGORY_CHOICES = [
        ("vegetable", "Vegetable"),
        ("fruit", "Fruit"),
        ("herb", "Herb"),
        ("meat", "Meat"),
        ("seafood", "Seafood"),
        ("dairy", "Dairy"),
        ("nut", "Nut"),
        ("seed", "Seed"),
        ("grain", "Grain"),
        ("pasta", "Pasta"),
        ("bread", "Bread"),
        ("cereal", "Cereal"),
        ("oil", "Oil"),
        ("spice", "Spice"),
        ("seasoning", "Seasoning"),
        ("sauce", "Sauce"),
        ("condiment", "Condiment"),
        ("dressing", "Dressing"),
        ("baking", "Baking"),
        ("sweetener", "Sweetener"),
        ("frozen", "Frozen"),
        ("canned", "Canned"),
        ("snack", "Snack"),
        ("beverage", "Beverage"),
        ("alcohol", "Alcohol"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to="ingredient_images/", blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    created_on = models.DateTimeField(auto_now_add=True)

    def add_ingredient(self):
        self.save()

    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=150)  # Name of the recipe
    image = models.ImageField(
        upload_to="recipe_images/", blank=True, null=True
    )  # Optional recipe image
    instructions = models.TextField()  # Detailed instructions for the recipe
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )  # User who created the recipe
    created_on = models.DateTimeField(
        auto_now_add=True
    )  # Timestamp when the recipe was created

    def get_ingredients(self):
        return self.recipe_ingredients.select_related("ingredient").all()

    def __str__(self):
        return self.name


class RecipeIngredient(models.Model):
    UNIT_CHOICES = [
        ("g", "grams"),
        ("kg", "kilograms"),
        ("mg", "milligrams"),
        ("ml", "milliliters"),
        ("l", "liters"),
        ("tsp", "teaspoon"),
        ("tbsp", "tablespoon"),
        ("cup", "cup"),
        ("oz", "ounce"),
        ("lb", "pound"),
        ("pcs", "pieces"),
        ("slice", "slice"),
        ("pinch", "pinch"),
        ("whole", "whole"),
        ("stalk", "stalk"),
        ("clove", "clove"),
        ("can", "can"),
        ("quart", "quart"),
        ("pint", "pint"),
    ]

    recipe = models.ForeignKey(
        Recipe,
        related_name="recipe_ingredients",
        on_delete=models.CASCADE,
    )  # Recipe this ingredient belongs to
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
    )  # The ingredient itself
    quantity = models.FloatField()  # The amount of the ingredient
    unit = models.CharField(
        max_length=10, choices=UNIT_CHOICES
    )  # Unit for the quantity

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.ingredient.name} for {self.recipe.name}"


class Note(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="note")
    content = models.TextField(blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notes for {self.user.username}"
