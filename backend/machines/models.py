from django.db import models
from django.utils import timezone
from users.models import Technicien

 

class Machine(models.Model):
    STATUT_CHOICES = [
        ('Fonctionnel', 'Fonctionnel'),
        ('En panne', 'En panne'),
        ('Maintenance', 'Maintenance'),
    ]
    nom = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default='Fonctionnel')
    dateDerniereMaintenance = models.DateTimeField(default=timezone.now)
    image = models.ImageField(upload_to='machine_images/', null=True, blank=True)

    def mettreAJourStatut(self, nouveau_statut):
        self.statut = nouveau_statut
        self.save()

    def __str__(self):
        return self.nom

class Schedule(models.Model):
    date_creation = models.DateTimeField(auto_now_add=True)
    tache = models.ForeignKey('Tache', on_delete=models.CASCADE, related_name='schedules', null=True, blank=True)
    
    def __str__(self):
        return f"Schedule {self.id} - {self.date_creation}"
class Intervention(models.Model):
    STATUT_CHOICES = [
        ('En attente', 'En attente'),
        ('En cours', 'En cours'),
        ('Terminé', 'Terminé'),
    ]
    description = models.TextField()
    dateDebut = models.DateTimeField(default=timezone.now)
    dateFin = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUT_CHOICES, default='En attente')
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='interventions')

    def ajouterTache(self, tache):
        tache.intervention = self
        tache.save()

    def finaliser(self):
        self.status = 'Terminé'
        self.dateFin = timezone.now()
        self.save()

    def __str__(self):
        return f"Intervention {self.id} - {self.status}"


class Tache(models.Model):
    EN_ATTENTE = 'En attente'
    EN_COURS = 'En cours'
    TERMINE = 'Terminé'
    
    STATUT_CHOICES = [
        (EN_ATTENTE, 'En attente'),
        (EN_COURS, 'En cours'),
        (TERMINE, 'Terminé'),
    ]

    description = models.TextField()
    technicien = models.ForeignKey(Technicien, on_delete=models.CASCADE, related_name='taches')
    date_debut = models.DateTimeField()
    date_fin = models.DateTimeField(null=True, blank=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default=EN_ATTENTE)
    assigned_to = models.ForeignKey(Technicien, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_taches')
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='taches')

    def accomplir(self):
        self.statut = self.TERMINE
        self.save()
        return True

    def __str__(self):
        return f"Tâche {self.id} - {self.statut}"


