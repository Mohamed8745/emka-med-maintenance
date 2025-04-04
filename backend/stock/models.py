from django.db import models

class PieceDeRechange(models.Model):
    nom = models.CharField(max_length=255)
    reference = models.CharField(max_length=255, unique=True)
    categorie = models.CharField(max_length=255)
    quantite = models.IntegerField()
    prxUnitaire = models.FloatField()
    image = models.ImageField(upload_to='image_piece/', blank=True, null=True)

    def __str__(self):
        return f"{self.nom} ({self.reference})"

class Stock(models.Model):
    capacite = models.IntegerField()
    emplacement = models.CharField(max_length=255)
    pieces = models.ManyToManyField(PieceDeRechange, through='StockPiece')

    def __str__(self):
        return f"Stock {self.id} - {self.emplacement}"

class StockPiece(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    piece = models.ForeignKey(PieceDeRechange, on_delete=models.CASCADE)
    quantite = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.piece.nom} dans {self.stock.emplacement} - Quantité: {self.quantite}"

    class Meta:
        unique_together = ('stock', 'piece')  