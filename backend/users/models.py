import os
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from stock.models import Stock
from datetime import datetime
from django.core.files.base import ContentFile
from PIL import Image
from io import BytesIO
from django.db import models

def get_upload_path(instance, filename):
    return f"imgUser/{datetime.now().strftime('%Y/%m/%d')}/{instance.username or instance.id}_{filename}"
class Utilisateur(AbstractUser):
    ROLES = (
        ('Technicien', 'Technicien'),
        ('Operateur', 'Operateur'),
        ('Admin', 'Admin'),
        ('Magasinier', 'Magasinier'),
        ('Responsable', 'Responsable'),
    )
    username = models.CharField(max_length=150, unique=True, blank=True, null=True) 
    role = models.CharField(max_length=20, choices=ROLES)
    numidentif = models.IntegerField(unique=True)
    numtel = models.IntegerField(unique=True , default=000000000)
    image = models.ImageField(upload_to="imgUser/%Y/%m/%d", null=True, blank=True)
    # حل مشكلة التعارض بإضافة related_name
    groups = models.ManyToManyField(Group, related_name="custom_user_groups" , blank=True )
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        if not extra_fields.get('numidentif'):
            raise ValueError('Superuser must have numidentif.')

        return self.create_user(email, password, **extra_fields)
    
    @property
    def is_admin(self):
        return self.role == 'Administrateur'

    @property
    def is_responsable(self):
        return self.role == 'Responsable'
    
    @property
    def is_magasinier(self):
        return self.role == 'Magasinier'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else self.email
    
    def save(self, *args, **kwargs):
        is_new = self._state.adding

        if self.image and not is_new:
            try:
                old = Utilisateur.objects.get(pk=self.pk)
                image_changed = old.image != self.image
            except Utilisateur.DoesNotExist:
                image_changed = True
        else:
            image_changed = True

        if self.image and image_changed:
            self.image.open()
            img = Image.open(self.image).convert("RGBA")
            img = img.resize((300, 300))

            buffer = BytesIO()
            img.save(buffer, format='PNG')
            image_content = ContentFile(buffer.getvalue())

            # إعادة تعيين الاسم حسب التاريخ
            new_name = get_upload_path(self, os.path.basename(self.image.name))
            self.image.save(new_name, image_content, save=False)

        super().save(*args, **kwargs)



class Magasinier(Utilisateur):
    stockgere = models.ManyToManyField(Stock)
    
    class Meta:
        verbose_name = "Magasinier"

class Operateur(Utilisateur):
    machinessurveillees = models.ManyToManyField('Machine')
    class Meta:
        verbose_name = "Operateur"

class Administrateur(Utilisateur):
    utilisateursgeres = models.ManyToManyField('self', symmetrical=False)
    is_admin = models.BooleanField(default=False)  # إضافة هذا الحقل
    
    def __str__(self):
        return f"{self.nomUT} {self.prenomUT}"
    
    class Meta:
        verbose_name = "Administrateur"
    
    

class Responsable(Utilisateur):
    class Meta:
        verbose_name = "Responsable"

class Technicien(Utilisateur):
    specialite = models.CharField(max_length=255)
    interventionsEffectuees = models.ManyToManyField('Intervention')
    
    class Meta:
        verbose_name = "Technicien"
    
class Machine(models.Model):
    pass

class Intervention(models.Model):
    pass

class Company(models.Model):
    nomuc = models.CharField(max_length=255)
    prenomuc = models.CharField(max_length=255)
    numidentifuc = models.IntegerField(unique=True)
    
