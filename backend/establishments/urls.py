from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TypeMasterViewSet, StatusMasterViewSet, ShiftMasterViewSet, EmployeeMasterTableView

router = DefaultRouter()
router.register('type-master', TypeMasterViewSet, basename='type-master')
router.register('status-master', StatusMasterViewSet, basename='status-master')
router.register('shift-master', ShiftMasterViewSet, basename='shift-master')

urlpatterns = [
    path('masters/', EmployeeMasterTableView.as_view(), name='employee-master-tables'),
]

# Add router URLs to urlpatterns
urlpatterns += router.urls
