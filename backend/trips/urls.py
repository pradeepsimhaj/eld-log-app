from django.urls import path
from .views import health_check, create_trip

urlpatterns = [
    path("health/", health_check),
    path("trips/", create_trip),
]
