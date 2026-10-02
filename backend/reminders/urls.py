from rest_framework.routers import DefaultRouter

from .views import ReminderViewSet


router = DefaultRouter()

router.register("reminders", ReminderViewSet)

urlpatterns = router.urls