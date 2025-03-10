from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    TypeMasterViewSet, 
    StatusMasterViewSet, 
    ShiftMasterViewSet, 
    EmployeeMasterTableView,
    EmployeeViewSet  # Add this import
)

router = DefaultRouter()
router.register('type-master', TypeMasterViewSet, basename='type-master')
router.register('status-master', StatusMasterViewSet, basename='status-master')
router.register('shift-master', ShiftMasterViewSet, basename='shift-master')
router.register('employees', EmployeeViewSet, basename='employees')  # Add this line

urlpatterns = [
    path('masters/', EmployeeMasterTableView.as_view(), name='employee-master-tables'),
    path('employees/by-department/<int:department_id>/', EmployeeViewSet.as_view({'get': 'by_department'}), name='employees-by-department'),
]

# Add router URLs to urlpatterns
urlpatterns += router.urls
