from rest_framework.routers import DefaultRouter

from .views import HabitLogViewSet, HabitViewSet


router = DefaultRouter()

router.register("habits", HabitViewSet)
router.register("habit-logs", HabitLogViewSet)

urlpatterns = router.urls