from rest_framework import serializers
from .models import Utilisateur, Magasinier, Operateur, Administrateur, Responsable, Technicien,Company
from django.utils.text import slugify
from rest_framework import serializers
from .models import Company

class UtilisateurSerializer(serializers.ModelSerializer):
    ROLE_CHOICES = [
        ('Technicien', 'Technicien'),
        ('Magasinier', 'Magasinier'),
        ('Responsable', 'Responsable'),
        ('Operateur', 'Operateur'),
        ('Admin', 'Admin'),
    ]
    
    role = serializers.ChoiceField(choices=ROLE_CHOICES, required=False)  # جعل role اختياريًا
    image = serializers.ImageField(required=False)  # السماح بتحديث الصورة اختياريًا    class Meta:
    class Meta:
        model = Utilisateur
        fields = ["username" ,"first_name" ,"last_name" ,"email"  ,"password" ,"numidentif" ,"numtel" ,"role" ,"image" ]
        extra_kwargs = {
            'password': {'write_only': True}  # لا نعرض كلمة المرور في الاستجابة
        }
        
    def create(self, validated_data):
        if "username" not in validated_data or not validated_data["username"]:
            validated_data["username"] = validated_data["first_name"]+ " " + validated_data["last_name"]
                
        
    def update(self, instance, validated_data):
        # هنا نقوم بتحديث الحقول الموجودة في validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # إذا كان هناك صورة جديدة يتم تحديثها
        if 'image' in validated_data:
            instance.image = validated_data['image']
            
        instance.save()
        return instance
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


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
        extra_kwargs = {
            'numidentifuc': {'validators': []},  # تعطيل التحقق من التكرار للتحديث
        }