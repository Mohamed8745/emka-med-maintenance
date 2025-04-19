from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db.models import Sum
from .models import PieceDeRechange, Stock, StockPiece
from .serializers import PieceDeRechangeSerializer, StockSerializer, StockPieceSerializer
from .permissions import IsMagasinierOrReadOnly

class PieceDeRechangeViewSet(viewsets.ModelViewSet):
    """
    إدارة قطع الغيار:
    - يمكن لـ Magasinier الإضافة والتعديل والحذف.
    - يمكن للمستخدمين الآخرين فقط رؤية البيانات.
    """
    queryset = PieceDeRechange.objects.all()
    serializer_class = PieceDeRechangeSerializer
    permission_classes = [permissions.IsAuthenticated, IsMagasinierOrReadOnly]

    def get_queryset(self):
        """
        إرجاع جميع قطع الغيار مع الكمية الإجمالية في المخزون.
        """
        queryset = PieceDeRechange.objects.annotate(
            total_quantite=Sum('stockpiece__quantite')
        )
        return queryset


class StockViewSet(viewsets.ModelViewSet):
    """
    إدارة المخزون:
    - يمكن لـ Magasinier فقط إدارة المخزون.
    - يمكن للمستخدمين الآخرين فقط رؤية البيانات.
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated, IsMagasinierOrReadOnly]



class StockPieceViewSet(viewsets.ModelViewSet):
    """
    إدارة العلاقة بين المخزون وقطع الغيار:
    - يمكن لـ Magasinier فقط إضافة أو تعديل أو حذف البيانات.
    - يمكن للمستخدمين الآخرين فقط رؤية البيانات.
    """
    serializer_class = StockPieceSerializer
    permission_classes = [permissions.IsAuthenticated, IsMagasinierOrReadOnly]
    #permission_classes = [AllowAny]

    def get_queryset(self):
        stock_id = self.request.query_params.get("stock")
        queryset = StockPiece.objects.select_related('piece', 'stock')
        if stock_id:
            return queryset.filter(stock_id=stock_id)
        return queryset.all()

