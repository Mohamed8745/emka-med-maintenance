import logging

# أنشئ logger مخصص للتوكن
token_logger = logging.getLogger('token')

class TokenLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')

        if access_token:
            token_logger.info(f"Access Token Received: {self._mask_token(access_token)}")
        else:
            token_logger.info("No Access Token Received")

        if refresh_token:
            token_logger.info(f"Refresh Token Received: {self._mask_token(refresh_token)}")
        else:
            token_logger.info("No Refresh Token Received")

        response = self.get_response(request)
        return response

    def _mask_token(self, token):
        """لأغراض الأمان: نخفي جزء من التوكن"""
        return token[:10] + '...' + token[-5:]
