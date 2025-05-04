
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PieceDeRechange, StockPiece, Stock
from .serializers import PieceDeRechangeSerializer, StockPieceSerializer, StockSerializer
from .permissions import IsMagasinierOrReadOnly

class PieceDeRechangeViewSet(viewsets.ModelViewSet):
    queryset = PieceDeRechange.objects.all()
    serializer_class = PieceDeRechangeSerializer
    permission_classes = [permissions.IsAuthenticated, IsMagasinierOrReadOnly]

    def perform_create(self, serializer):
        stock_id = self.request.data.get("stock_id")
        stock = Stock.objects.get(id=stock_id)
        serializer.save()
        piece = serializer.instance
        StockPiece.objects.create(piece=piece, stock=stock, quantite=piece.quantite)
        
    def destroy(self, request, *args, **kwargs):
            instance = self.get_object()
            instance.images.all().delete()
            self.perform_destroy(instance)
            return Response(status=204)

class StockPieceViewSet(viewsets.ModelViewSet):
    queryset = StockPiece.objects.all()
    serializer_class = StockPieceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        stock_id = self.request.query_params.get("stock")
        piece_id = self.request.query_params.get("piece")

        if stock_id:
            queryset = queryset.filter(stock__id=stock_id)
        if piece_id:
            queryset = queryset.filter(piece__id=piece_id)

        return queryset

    @action(detail=False, methods=["delete"])
    def delete_by_piece(self, request):
        piece_id = request.query_params.get("piece")
        if not piece_id:
            return Response({"error": "Piece ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        deleted, _ = StockPiece.objects.filter(piece__id=piece_id).delete()
        if deleted:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "StockPiece not found"}, status=status.HTTP_404_NOT_FOUND)

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [permissions.IsAuthenticated]
