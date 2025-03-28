from django.contrib import admin
from .models import Machine, Intervention, Tache, Schedule

admin.site.register(Machine)
admin.site.register(Intervention)
admin.site.register(Tache)
admin.site.register(Schedule)
