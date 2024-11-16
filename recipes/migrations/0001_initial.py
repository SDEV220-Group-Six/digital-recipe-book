# Generated by Django 5.1.3 on 2024-11-16 17:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Ingredient",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "category",
                    models.CharField(
                        choices=[
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
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "image",
                    models.ImageField(
                        blank=True, null=True, upload_to="ingredient_images/"
                    ),
                ),
                ("created_on", models.DateTimeField(auto_now_add=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
