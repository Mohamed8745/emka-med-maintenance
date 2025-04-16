from django.db import models
from django.db.models import Sum

class PieceDeRechange(models.Model):
    name = models.CharField(max_length=255)
    reference = models.CharField(max_length=255, unique=True)
    categorie = models.CharField(max_length=255)
    quantite = models.IntegerField()
    prxUnitaire = models.FloatField()
    image = models.ImageField(upload_to='image_piece/', blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.reference})"

class Stock(models.Model):
    name = models.CharField(max_length=255, blank=True)
    content = models.CharField(max_length=255)
    capacite = models.IntegerField()
    pieces = models.ManyToManyField(PieceDeRechange, through='StockPiece')

    def save(self, *args, **kwargs):
        creating = self.pk is None
        super().save(*args, **kwargs)
        if creating and not self.name:
            self.name = f"stock {self.id}"
            super().save(update_fields=["name"])
            
    @property
    def capacite_utilisee(self):
        return self.stockpiece_set.aggregate(
            total=Sum('quantite')
        )['total'] or 0

    @property
    def capacite_libre(self):
        return self.capacite - self.capacite_utilisee

    def __str__(self):
        return f"Stock {self.id} - {self.name}"

class StockPiece(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    piece = models.ForeignKey(PieceDeRechange, on_delete=models.CASCADE)
    quantite = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.piece.name} dans {self.stock.name} - Quantité: {self.quantite}"

    class Meta:
        unique_together = ('stock', 'piece')  