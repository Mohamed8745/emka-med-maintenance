from django.contrib import admin
from .models import Probleme , Rapport

class ProblemeAdmin(admin.ModelAdmin):
    list_display=("id","description", "statu", "date_signalement",)
    list_filter=("statu", "date_signalement",)
    search_fields=("description",)


class RapportAdmin(admin.ModelAdmin):
    list_display = ('id', 'date_creation', 'type')
    search_fields = ('type', 'contenu')


admin.site.register(Probleme,ProblemeAdmin)
admin.site.register(Rapport,RapportAdmin)
