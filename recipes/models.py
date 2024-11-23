from django.db import models
from django.conf import settings
from django.utils import timezone

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
