from django.contrib import admin
from .models import AIAnalyzer,Recommendation,Diagnostic

# Register your models here.

admin.site.register(AIAnalyzer)
admin.site.register(Recommendation)
admin.site.register(Diagnostic)