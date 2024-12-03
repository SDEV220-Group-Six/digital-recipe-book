from django import forms
from .models import Recipe, Ingredient, RecipeIngredient


class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ["name", "image", "instructions"]
        widgets = {
            "instructions": forms.Textarea(
                attrs={"placeholder": "Enter cooking instructions here..."}
            ),
        }


class RecipeIngredientForm(forms.ModelForm):
    class Meta:
        model = RecipeIngredient
        fields = ["ingredient", "quantity", "unit"]

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user", None)
        super().__init__(*args, **kwargs)
        if user:
            self.fields["ingredient"].queryset = Ingredient.objects.filter(
                created_by=user
            )
