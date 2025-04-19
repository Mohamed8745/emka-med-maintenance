from rest_framework import serializers
from .models import PieceDeRechange, Stock, StockPiece

class PieceDeRechangeSerializer(serializers.ModelSerializer):
    total_quantite = serializers.IntegerField(read_only=True)

    class Meta:
        model = PieceDeRechange
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    capacite_utilisee = serializers.ReadOnlyField()
    capacite_libre = serializers.ReadOnlyField()
    class Meta:
        model = Stock
        fields = '__all__'

class StockPieceSerializer(serializers.ModelSerializer):
    piece = PieceDeRechangeSerializer()  # تسلسل متداخل لقطعة الغيار
    stock = StockSerializer()
    class Meta:
        model = StockPiece
        fields = '__all__'
