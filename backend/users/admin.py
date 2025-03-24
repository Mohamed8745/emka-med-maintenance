from django.contrib import admin
from django.utils.html import format_html
from .models import Utilisateur, Magasinier, Operateur, Administrateur, Responsable, Technicien,Company

class UserImgAdmin(admin.ModelAdmin):
    list_display = ('id', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" />', obj.image.url)
        return "No Image"

admin.site.register(Utilisateur, UserImgAdmin)
admin.site.register(Magasinier)
admin.site.register(Operateur)
admin.site.register(Administrateur)
admin.site.register(Responsable)
admin.site.register(Technicien)
admin.site.register(Company)
