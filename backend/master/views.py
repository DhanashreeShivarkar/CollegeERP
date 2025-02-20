from rest_framework.views import APIView
from rest_framework.response import Response

class MasterTableListView(APIView):
    def get(self, request):
        master_tables = [
            {"name": "country", "display_name": "Country", "endpoint": "/api/master/countries/"},
            {"name": "state", "display_name": "State", "endpoint": "/api/master/states/"},
            {"name": "city", "display_name": "City", "endpoint": "/api/master/cities/"},
            {"name": "currency", "display_name": "Currency", "endpoint": "/api/master/currencies/"},
            {"name": "language", "display_name": "Language", "endpoint": "/api/master/languages/"},
            {"name": "university", "display_name": "University", "endpoint": "/api/master/universities/"},
            {"name": "institute", "display_name": "Institute", "endpoint": "/api/master/institutes/"},
            {"name": "program", "display_name": "Program", "endpoint": "/api/master/programs/"},
            {"name": "branch", "display_name": "Branch", "endpoint": "/api/master/branches/"},
            {"name": "designation", "display_name": "Designation", "endpoint": "/api/master/designations/"},
            {"name": "category", "display_name": "Category", "endpoint": "/api/master/categories/"}
        ]
        return Response(master_tables)
