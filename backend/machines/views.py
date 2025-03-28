from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Machine, Intervention, Tache, Schedule
from .serializers import MachineSerializer, InterventionSerializer, TacheSerializer, ScheduleSerializer

#  Machines Views
class MachineListCreateView(generics.ListCreateAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer

class MachineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Machine.objects.all()
    serializer_class = MachineSerializer


#  Interventions Views
class InterventionListCreateView(generics.ListCreateAPIView):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer

class InterventionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer

class InterventionFinalizeView(APIView):
    def post(self, request, pk):
        try:
            intervention = Intervention.objects.get(pk=pk)
            intervention.finaliser()
            return Response({'message': 'Intervention finalisée avec succès.'})
        except Intervention.DoesNotExist:
            return Response({'error': 'Intervention non trouvée.'}, status=404)


# Taches Views
class TacheListCreateView(generics.ListCreateAPIView):
    queryset = Tache.objects.all()
    serializer_class = TacheSerializer

class TacheDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tache.objects.all()
    serializer_class = TacheSerializer

class TacheAccomplirView(APIView):
    def post(self, request, pk):
        try:
            tache = Tache.objects.get(pk=pk)
            tache.accomplir()
            return Response({'message': 'Tâche accomplie avec succès.'})
        except Tache.DoesNotExist:
            return Response({'error': 'Tâche non trouvée.'}, status=404)


#  Schedule Views
class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
