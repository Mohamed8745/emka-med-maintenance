import os
from datetime import datetime
from io import BytesIO
from django.db import models
from django.core.files.base import ContentFile
from django.utils.text import slugify
from PIL import Image
from rembg import remove
from django.db.models import Sum
import logging

logger = logging.getLogger(__name__)

def get_new_upload_path(instance, filename):
    # Access the name from the related PieceDeRechange via the piece ForeignKey
    piece_name = instance.piece.name if instance.piece.name else str(instance.piece.id)
    # Sanitize the piece name to ensure it's a valid filename
    piece_name = slugify(piece_name, allow_unicode=True)
    upload_path = f"image_piece/{datetime.now().strftime('%Y/%m/%d')}/{piece_name}_{filename}"
    logger.info(f"Generating upload path for PieceImage: piece_name={piece_name}, filename={filename}, path={upload_path}")
    return upload_path

class PieceDeRechange(models.Model):
    name = models.CharField(max_length=255)
    reference = models.CharField(max_length=255, unique=True)
    categorie = models.CharField(max_length=255)
    quantite = models.IntegerField()
    prxUnitaire = models.FloatField()
    condition = models.CharField(max_length=50, choices=[('New', 'New'), ('Used', 'Used')], default='New')

    def __str__(self):
        return f"{self.name} ({self.reference})"

    def save(self, *args, **kwargs):
        stock_id = kwargs.pop('stock_id', None)
        creating = self.pk is None

        # Save the piece
        super().save(*args, **kwargs)

        # Link it to a stock via StockPiece
        if creating and stock_id:
            try:
                stock = Stock.objects.get(id=stock_id)
                StockPiece.objects.create(
                    stock=stock,
                    piece=self,
                    quantite=self.quantite
                )
            except Stock.DoesNotExist:
                logger.error(f"No stock found with ID {stock_id}")

class PieceImage(models.Model):
    piece = models.ForeignKey('PieceDeRechange', related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_new_upload_path, blank=True, null=True)

    def __str__(self):
        return f"Image for {self.piece.reference}"

    def save(self, *args, **kwargs):
        if self.image and hasattr(self.image, 'file'):
            try:
                logger.info(f"Processing image for piece {self.piece.reference}: {self.image.name}")
                img_data = self.image.read()
                if img_data:
                    Image.open(BytesIO(img_data)).verify()
                    self.image.seek(0)
                    img_data = self.image.read()
                    img_no_bg = remove(img_data)
                    img_pil = Image.open(BytesIO(img_no_bg)).convert("RGBA")
                    logger.info(f"Image format: {img_pil.format}, size: {img_pil.size}")
                    img_resized = img_pil.resize((250, 250))

                    buffer = BytesIO()
                    img_resized.save(buffer, format='PNG')
                    self.image.save(
                        os.path.basename(self.image.name),
                        ContentFile(buffer.getvalue()),
                        save=False
                    )
            except Exception as e:
                logger.error(f"Error processing image for piece {self.piece.reference}: {e}")
                self.image = None
                logger.warning(f"Image for piece {self.piece.reference} set to None due to processing error.")
                from rest_framework import serializers
                raise serializers.ValidationError(f"Failed to process image: {str(e)}")

        super().save(*args, **kwargs)

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