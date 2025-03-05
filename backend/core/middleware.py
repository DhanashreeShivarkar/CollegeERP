from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

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

class SessionManagementMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request, 'session') and request.session.get('user_id'):
            # Check last activity
            last_activity = request.session.get('last_activity')
            if last_activity:
                last_activity = timezone.datetime.fromisoformat(last_activity)
                if timezone.now() - last_activity > timedelta(hours=1):
                    # Session expired
                    logger.info(f"Session expired for user {request.session.get('user_id')}")
                    request.session.flush()
                    
            # Update last activity
            request.session['last_activity'] = timezone.now().isoformat()
            request.session.modified = True

        response = self.get_response(request)
        return response
