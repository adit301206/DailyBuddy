from rest_framework.routers import DefaultRouter

from .views import CommitmentLogViewSet, CommitmentViewSet


router = DefaultRouter()

router.register("commitments", CommitmentViewSet)
router.register("commitment-logs", CommitmentLogViewSet)

urlpatterns = router.urls