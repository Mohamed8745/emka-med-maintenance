from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from stock.models import Stock

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
    image = models.ImageField(upload_to='imgUser/', null=True, blank=True)
    # حل مشكلة التعارض بإضافة related_name
    groups = models.ManyToManyField(Group, related_name="custom_user_groups" , blank=True )
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)
    
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
    
