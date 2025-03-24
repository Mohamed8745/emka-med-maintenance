from django.contrib import admin
from .models import PieceDeRechange,Stock,StockPiece
# Register your models here.
admin.site.register(PieceDeRechange)
admin.site.register(Stock)
admin.site.register(StockPiece)