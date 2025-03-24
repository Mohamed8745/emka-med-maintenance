from django.db import models

class AIAnalyzer(models.Model):
    details = models.TextField()
    confidence = models.FloatField()

    def __str__(self):
        return f"AIAnalyzer {self.id} - Confidence: {self.confidence}"

class Recommendation(models.Model):
    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    description = models.TextField()
    priority = models.CharField(max_length=50, choices=PRIORITY_CHOICES)

    def __str__(self):
        return f"Recommendation {self.id} - Priority: {self.priority}"

class Diagnostic(models.Model):
    TYPE_CHOICES = [
        ('Type1', 'Type 1'),
        ('Type2', 'Type 2'),
        ('Type3', 'Type 3'),
    ]

    details = models.TextField()
    confidence = models.FloatField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)

    def __str__(self):
        return f"Diagnostic {self.id} - Type: {self.type}, Confidence: {self.confidence}"