from django.urls import path
from .views import (
    MachineListCreateView, MachineDetailView,
    InterventionListCreateView, InterventionDetailView, InterventionFinalizeView,
    TacheListCreateView, TacheDetailView, TacheAccomplirView,
    ScheduleListCreateView, ScheduleDetailView
)

urlpatterns = [
    # Machines
    path('machines/', MachineListCreateView.as_view(), name='machine-list-create'),
    path('machines/<int:pk>/', MachineDetailView.as_view(), name='machine-detail'),

    # Interventions
    path('interventions/', InterventionListCreateView.as_view(), name='intervention-list-create'),
    path('interventions/<int:pk>/', InterventionDetailView.as_view(), name='intervention-detail'),
    path('interventions/<int:pk>/finaliser/', InterventionFinalizeView.as_view(), name='intervention-finaliser'),

    # Taches
    path('taches/', TacheListCreateView.as_view(), name='tache-list-create'),
    path('taches/<int:pk>/', TacheDetailView.as_view(), name='tache-detail'),
    path('taches/<int:pk>/accomplir/', TacheAccomplirView.as_view(), name='tache-accomplir'),

    # Schedule
    path('schedules/', ScheduleListCreateView.as_view(), name='schedule-list-create'),
    path('schedules/<int:pk>/', ScheduleDetailView.as_view(), name='schedule-detail'),
]
