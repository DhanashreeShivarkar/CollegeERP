from django.contrib import admin
from .models import DESIGNATION, CustomUser

@admin.register(DESIGNATION)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('NAME', 'CODE', 'IS_ACTIVE', 'CREATED_AT')
    search_fields = ('NAME', 'CODE')
    list_filter = ('IS_ACTIVE',)

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):  # Change from UserAdmin to admin.ModelAdmin
    list_display = ('USER_ID', 'USERNAME', 'EMAIL', 'DESIGNATION', 'IS_ACTIVE', 'IS_EMAIL_VERIFIED')
    list_filter = ('IS_ACTIVE', 'DESIGNATION', 'IS_EMAIL_VERIFIED', 'IS_LOCKED')
    search_fields = ('USER_ID', 'USERNAME', 'EMAIL', 'FIRST_NAME', 'LAST_NAME')
    ordering = ('USER_ID',)
    
    fieldsets = (
        (None, {
            'fields': ('USER_ID', 'USERNAME', 'PASSWORD')
        }),
        ('Personal Information', {
            'fields': ('FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE_NUMBER', 'PROFILE_PICTURE')
        }),
        ('Designation & Permissions', {
            'fields': ('DESIGNATION', 'IS_ACTIVE', 'IS_STAFF', 'IS_SUPERUSER')
        }),
        ('Status', {
            'fields': ('IS_EMAIL_VERIFIED', 'IS_LOCKED', 'LOCKED_UNTIL')
        }),
        ('Security', {
            'fields': ('LAST_LOGIN', 'LAST_LOGIN_IP', 'FAILED_LOGIN_ATTEMPTS')
        })
    )

    readonly_fields = (
        'LAST_LOGIN', 'LAST_LOGIN_IP', 'FAILED_LOGIN_ATTEMPTS',
        'IS_LOCKED', 'LOCKED_UNTIL', 'CREATED_AT', 'UPDATED_AT'
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('USER_ID',)
        return self.readonly_fields
