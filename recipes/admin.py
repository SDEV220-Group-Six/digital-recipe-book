from django.contrib import admin
from .models import Ingredient, Note

# Register your models here.

admin.site.register(Ingredient)
admin.site.register(Note)