# Generated by Django 4.0.2 on 2022-03-24 12:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0016_cartitem_delete_cart"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="cartitem",
            name="items",
        ),
        migrations.AddField(
            model_name="cartitem",
            name="ingredient",
            field=models.ForeignKey(
                default=19,
                on_delete=django.db.models.deletion.CASCADE,
                to="api.ingredient",
            ),
            preserve_default=False,
        ),
    ]