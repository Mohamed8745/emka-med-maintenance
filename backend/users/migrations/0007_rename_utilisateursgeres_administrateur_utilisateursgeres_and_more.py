# Generated by Django 5.1.7 on 2025-03-22 07:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_rename_nomut_company_nomuc_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='administrateur',
            old_name='utilisateursGeres',
            new_name='utilisateursgeres',
        ),
        migrations.RenameField(
            model_name='company',
            old_name='numIdentifuc',
            new_name='numidentifuc',
        ),
        migrations.RenameField(
            model_name='magasinier',
            old_name='stockGere',
            new_name='stockgere',
        ),
        migrations.RenameField(
            model_name='operateur',
            old_name='machinesSurveillees',
            new_name='machinessurveillees',
        ),
        migrations.RenameField(
            model_name='utilisateur',
            old_name='numIdentif',
            new_name='numidentif',
        ),
        migrations.RenameField(
            model_name='utilisateur',
            old_name='numTel',
            new_name='numtel',
        ),
    ]
