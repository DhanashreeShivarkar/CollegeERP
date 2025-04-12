from rest_framework import serializers
from exam.models import COLLEGE_EXAM_TYPE

class CollegeExamTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = COLLEGE_EXAM_TYPE
        fields = ['RECORD_ID', 'ACADEMIC_YEAR', 'PROGRAM_ID', 'EXAM_TYPE', 'IS_ACTIVE', 'CREATED_BY', 'UPDATED_BY', 'DELETED_BY', 'DELETED_AT', 'IS_DELETED']