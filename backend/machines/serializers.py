from rest_framework import serializers
from .models import Machine, Intervention, Tache, Schedule
from users.models import Technicien

class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'

class InterventionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intervention
        fields = '__all__'

class TacheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tache
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class TechnicienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Technicien
        fields = '__all__'
