# Generated by Django 5.1.7 on 2025-04-19 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0007_alter_stock_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='piecederechange',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='image_piece/%Y/%m/%d/'),
        ),
    ]
