from django.db import models
from django.conf import settings
from recipes.models import RecipeIngredient

# Create your models here.


class ShoppingList(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.pk:
            has_active_list = ShoppingList.objects.filter(
                created_by=self.created_by, active=True
            ).exists()

            if not has_active_list:
                self.active = True

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.active}"


class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(
        ShoppingList, related_name="items", on_delete=models.CASCADE
    )
    recipe_ingredient = models.ForeignKey(RecipeIngredient, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.recipe_ingredient.quantity} {self.recipe_ingredient.unit} of {self.recipe_ingredient.ingredient.name} in {self.shopping_list.name}"
