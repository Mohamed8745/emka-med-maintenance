import logging
from rest_framework import serializers
from .models import PieceDeRechange, Stock, StockPiece, PieceImage
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)

class PieceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PieceImage
        fields = ['id', 'image']

class PieceDeRechangeSerializer(serializers.ModelSerializer):
    stock_id = serializers.IntegerField(required=False)
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        allow_empty=True
    )
    image_list = PieceImageSerializer(many=True, read_only=True, source='images')

    class Meta:
        model = PieceDeRechange
        fields = ["id", "name", "reference", "categorie", "quantite", "prxUnitaire", "condition" , "images", "image_list", "stock_id"]

    def validate_stock_id(self, value):
        if value is not None:
            try:
                Stock.objects.get(id=value)
            except Stock.DoesNotExist:
                raise serializers.ValidationError("المخزن غير موجود.")
        return value

    def validate(self, data):
        if not data.get("name") or not data.get("name").strip():
            raise serializers.ValidationError({"name": "This field cannot be blank."})
        if not data.get("reference") or not data.get("reference").strip():
            raise serializers.ValidationError({"reference": "This field cannot be blank."})
        if not data.get("categorie") or not data.get("categorie").strip():
            raise serializers.ValidationError({"categorie": "This field cannot be blank."})
        if data.get("prxUnitaire", 0) <= 0:
            raise serializers.ValidationError({"prxUnitaire": "Unit price must be greater than 0."})
        if data.get("quantite", 0) <= 0:
            raise serializers.ValidationError({"quantite": "Quantity must be greater than 0."})
        return data

    def create(self, validated_data):
        stock_id = validated_data.pop("stock_id", None)
        images = validated_data.pop("images", [])
        piece = PieceDeRechange.objects.create(**validated_data)

        if stock_id:
            try:
                stock = Stock.objects.get(id=stock_id)
                StockPiece.objects.create(
                    stock=stock,
                    piece=piece,
                    quantite=piece.quantite
                )
            except Stock.DoesNotExist:
                logger.error(f"No stock found with ID {stock_id}")
                
    def update(self, instance, validated_data):
        logger.info(f"Raw request data: {self.context['request'].data}")
        logger.info(f"Received update data: {validated_data}")
        images = validated_data.pop("images", [])

        # Update fields
        instance.name = validated_data.get("name", instance.name)
        instance.reference = validated_data.get("reference", instance.reference)
        instance.categorie = validated_data.get("categorie", instance.categorie)
        instance.prxUnitaire = validated_data.get("prxUnitaire", instance.prxUnitaire)
        instance.quantite = validated_data.get("quantite", instance.quantite)

        # Handle image updates
        if images:
            instance.images.all().delete()
            for image in images:
                PieceImage.objects.create(
                    piece=instance,
                    image=image
                )
                logger.info(f"Image updated for piece: {instance.reference}")

        instance.save()

        # Update associated StockPiece quantity
        stock_piece = StockPiece.objects.filter(piece=instance).first()
        if stock_piece:
            stock_piece.quantite = instance.quantite
            stock_piece.save()

        return instance

class StockPieceSerializer(serializers.ModelSerializer):
    piece = PieceDeRechangeSerializer()
    stock = serializers.StringRelatedField()

    class Meta:
        model = StockPiece
        fields = ["id", "piece", "quantite", "stock"]

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["id", "name", "content", "capacite", "capacite_utilisee", "capacite_libre"]