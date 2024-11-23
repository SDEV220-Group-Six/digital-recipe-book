from rest_framework import serializers
from .models import Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'category', 'image', 'created_by', 'created_on']
        read_only_fields = ['id', 'created_by', 'created_on']

