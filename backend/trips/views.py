from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import TripSerializer
from .services.hos_calculator import calculate_daily_logs


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok"})


@api_view(["POST"])
def create_trip(request):
    serializer = TripSerializer(data=request.data)

    if serializer.is_valid():
        # TEMPORARY distance (will be replaced with map API)
        MOCK_DISTANCE_MILES = 1200

        hos_data = calculate_daily_logs(
    distance_miles=MOCK_DISTANCE_MILES,
    cycle_used_hours=serializer.validated_data["current_cycle_used"],
    use_sleeper=serializer.validated_data["use_sleeper"]
)

        return Response(
            {
                "message": "Trip planned successfully",
                "trip": serializer.validated_data,
                "hos": hos_data
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
