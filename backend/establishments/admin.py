from django.contrib import admin
from .models import TYPE_MASTER, STATUS_MASTER, SHIFT_MASTER

@admin.register(TYPE_MASTER)
class TypeMasterAdmin(admin.ModelAdmin):
    list_display = ('ID', 'RECORD_WORD', 'CREATED_BY', 'CREATED_AT')
    search_fields = ('RECORD_WORD', 'CREATED_BY')
    list_filter = ('IS_DELETED',)  # Changed from IS_ACTIVE to IS_DELETED

@admin.register(STATUS_MASTER)
class StatusMasterAdmin(admin.ModelAdmin):
    list_display = ('ID', 'RECORD_WORD', 'CREATED_BY', 'CREATED_AT', 'UPDATED_AT')
    search_fields = ('RECORD_WORD', 'CREATED_BY')
    list_filter = ('IS_DELETED',)  # Changed from IS_ACTIVE to IS_DELETED

@admin.register(SHIFT_MASTER)
class ShiftMasterAdmin(admin.ModelAdmin):
    list_display = ('ID', 'SHIFT_NAME', 'FROM_TIME', 'TO_TIME', 'CREATED_AT')
    search_fields = ('SHIFT_NAME', 'CREATED_BY')
    list_filter = ('IS_DELETED',)  # Changed from IS_ACTIVE to IS_DELETED
