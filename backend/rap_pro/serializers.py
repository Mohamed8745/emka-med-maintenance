from rest_framework import serializers
from .models import Probleme, Rapport

class ProblemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Probleme
        fields = ['id', 'description', 'statu', 'date_signalement', 'image']

class RapportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rapport
        fields = ['id', 'date_creation', 'type', 'contenu']
