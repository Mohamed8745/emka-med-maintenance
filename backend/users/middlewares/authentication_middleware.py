class JWTAuthFromCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # استثناء المسارات التي لا تحتاج إلى مصادقة مثل login
        if request.path.startswith('/api/login/'):
            return self.get_response(request)

        # حاول الحصول على التوكن من الكوكي
        access_token = request.COOKIES.get("access_token")
        
        if access_token:
            # إضافة التوكن في الـ Authorization header
            request.META["HTTP_AUTHORIZATION"] = f"Bearer {access_token}"
        
        if request.path.startswith('/admin/'):
            return self.get_response(request)

        
        # متابعة باقي العملية
        return self.get_response(request)
    
