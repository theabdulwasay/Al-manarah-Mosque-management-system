from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, VolunteerCommitteeViewSet

router = DefaultRouter()
router.register('members', MemberViewSet, basename='member')
router.register('committee', VolunteerCommitteeViewSet, basename='committee')

urlpatterns = router.urls
