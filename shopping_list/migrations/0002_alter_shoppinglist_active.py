# Generated by Django 5.1.3 on 2024-12-07 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("shopping_list", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shoppinglist",
            name="active",
            field=models.BooleanField(default=False),
        ),
    ]