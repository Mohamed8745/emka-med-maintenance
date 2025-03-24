from rest_framework import serializers
from .models import Utilisateur, Magasinier, Operateur, Administrateur, Responsable, Technicien,Company
from django.utils.text import slugify

class UtilisateurSerializer(serializers.ModelSerializer):
    ROLE_CHOICES = [
        ('Technicien', 'Technicien'),
        ('Magasinier', 'Magasinier'),
        ('Responsable', 'Responsable'),
        ('Operateur', 'Operateur'),
        ('Admin', 'Admin'),
    ]
    
    role = serializers.ChoiceField(choices=ROLE_CHOICES)
    class Meta:
        model = Utilisateur
        fields = ["username" ,"first_name" ,"last_name" ,"email"  ,"password" ,"numidentif" ,"numtel" ,"role" ,"image" ]
        
        def create(self, validated_data):
            if "username" not in validated_data or not validated_data["username"]:
                validated_data["username"] = validated_data["first_name"]+ " " + validated_data["last_name"]
class MagasinierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Magasinier
        fields = '__all__'

class OperateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operateur
        fields = '__all__'

class AdministrateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrateur
        fields = '__all__'

class ResponsableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsable
        fields = '__all__'

class TechnicienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technicien
        fields = '__all__'
        
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'