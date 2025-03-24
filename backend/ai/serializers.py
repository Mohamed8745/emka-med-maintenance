from rest_framework import serializers
from .models import AIAnalyzer, Recommendation, Diagnostic

class AIAnalyzerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalyzer
        fields = '__all__'

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = '__all__'

class DiagnosticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnostic
        fields = '__all__'
