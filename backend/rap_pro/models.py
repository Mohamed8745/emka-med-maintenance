from django.db import models
from enum import Enum
from django.utils import timezone

class StatuEnum(Enum):
    OUVERT = "ouvert"
    EN_COURS = "en cours"
    RESOLU = "résolu"

    @classmethod
    def choices(cls):
        return [(status.value, status.value) for status in cls]

class Probleme(models.Model):
    description = models.TextField()
    statu = models.CharField(
        max_length=20,
        choices=StatuEnum.choices(),
        default=StatuEnum.OUVERT.value
    )
    date_signalement = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='imgprob/', null=True, blank=True)

    def change_statut(self, new_statut):
        if new_statut in dict(StatuEnum.choices()).keys():
            self.statu = new_statut
            self.save()
        else:
            raise ValueError("Statut non valide")

    def __str__(self):
        return f"Problème {self.id} - {self.description[:30]}..."

class Rapport(models.Model):
    date_creation = models.DateField(default=timezone.now)
    type = models.CharField(max_length=255, blank=True, null=True)
    contenu = models.TextField()

    def generer_pdf(self):
        # منطق إنشاء ملف PDF (يمكن استخدام مكتبة ReportLab أو WeasyPrint)
        pass  

    def envoyer_par_email(self, destinataire):
        # منطق إرسال البريد الإلكتروني (يمكن استخدام مكتبة smtplib أو Django Email)
        pass  

    def afficher_details(self):
        return f"Type: {self.type}, Contenu: {self.contenu[:50]}..." 

    def __str__(self):
        return f"Rapport {self.id} - {self.type if self.type else 'Sans type'}"