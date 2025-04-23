from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    user_info,
    generate_timetable,
    TeacherViewSet,
    CourseViewSet,
    RoomViewSet,
    TimeSlotViewSet
)

router = DefaultRouter()
router.register(r'teachers', TeacherViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'timeslots', TimeSlotViewSet)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-info/', user_info, name='user_info'),
    path('generate-timetable/', generate_timetable, name='generate_timetable'),
    path('', include(router.urls)),
]