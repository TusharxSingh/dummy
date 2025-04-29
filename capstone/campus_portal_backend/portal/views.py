from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets

from .models import Teacher, Course, Room, TimeSlot, TimetableEntry
from .serializers import TeacherSerializer, CourseSerializer, RoomSerializer, TimeSlotSerializer, TimetableEntrySerializer

from portal.services.genetic_algorithm import generate_timetable as ga_generate_timetable

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        "username": user.username,
        "role": user.role,
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_timetable(request):
    try:
        max_hours = request.data.get("max_hours_per_day", 5)

        teachers = list(Teacher.objects.values("id", "first_name", "last_name"))
        courses = list(Course.objects.values("id", "name", "teacher_id","number_of_lectures", "number_of_labs"))
        rooms = list(Room.objects.values("id", "name", "type"))

        timeslots = [
            {
                "id": ts.id,
                "day": ts.day.name,
                "slot": f"{ts.start_time.strftime('%H:%M')} - {ts.end_time.strftime('%H:%M')}"
            }
            for ts in TimeSlot.objects.select_related("day").all()
        ]

        constraints = {"max_hours_per_day": int(max_hours)}

        result = ga_generate_timetable(teachers, courses, rooms, timeslots, constraints)
        return Response(result)

    except Exception as e:
        print(f"\U0001F525 Error in generate_timetable: {e}")
        return Response({"error": str(e)}, status=500)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

@api_view(["POST"])
def save_timetable(request):
    """
    Delete old timetable and save new one.
    Expected: JSON list of entries [{subject, type, room, day, time, teacher}]
    """
    TimetableEntry.objects.all().delete()
    serializer = TimetableEntrySerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Timetable saved successfully."})
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=400)

@api_view(["GET"])
def get_timetable(request):
    teacher_id = request.query_params.get('teacher_id', None)

    if not teacher_id:
        return Response({"error": "Teacher id is required."}, status=400)

    # Filter timetable entries by teacher's name
    timetable = TimetableEntry.objects.filter(teacher=teacher_id)
    
    if not timetable.exists():
        return Response({"error": "No timetable entries found for this teacher."}, status=404)
    print("Timetable Entries:", timetable)
    
    serializer = TimetableEntrySerializer(timetable, many=True)
    return Response(serializer.data)



@api_view(["DELETE"])
def delete_timetable(request):
    TimetableEntry.objects.all().delete()
    return Response({"message": "Timetable deleted successfully."})