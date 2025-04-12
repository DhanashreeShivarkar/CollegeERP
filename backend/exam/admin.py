from django.contrib import admin
from .models import COLLEGE_EXAM_TYPE

@admin.register(COLLEGE_EXAM_TYPE)
class CollegeExamTypeAdmin(admin.ModelAdmin):
    list_display = ('RECORD_ID', 'ACADEMIC_YEAR', 'PROGRAM_ID', 'EXAM_TYPE', 'IS_ACTIVE', 'IS_DELETED', 'DELETED_BY', 'DELETED_AT')
    search_fields = ('ACADEMIC_YEAR', 'EXAM_TYPE')
    list_filter = ('IS_ACTIVE', 'IS_DELETED')

