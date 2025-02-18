from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone

class AuditMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if hasattr(request, 'user'):
            request._audit_user = request.user
            request._audit_timestamp = timezone.now()

    def process_response(self, request, response):
        if hasattr(request, '_audit_user'):
            delattr(request, '_audit_user')
        if hasattr(request, '_audit_timestamp'):
            delattr(request, '_audit_timestamp')
        return response
