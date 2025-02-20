from django.urls import path
from .views import MasterTableListView

urlpatterns = [
    path('tables/', MasterTableListView.as_view(), name='master-tables'),
]
