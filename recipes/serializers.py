from rest_framework import serializers
from .models import Ingredient


class IngredientSerializer(serializers.ModelSerializer):
    is_used = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = [
            "id",
            "name",
            "category",
            "image",
            "created_by",
            "created_on",
            "is_used",
        ]
        read_only_fields = ["id", "created_by", "created_on"]

    def get_is_used(self, obj):
        return getattr(obj, "is_used", False)
