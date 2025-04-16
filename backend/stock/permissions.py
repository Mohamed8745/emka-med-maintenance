from rest_framework import permissions

class IsMagasinierOrReadOnly(permissions.BasePermission):
    """
    السماح فقط لـ Magasinier بإدارة المخزون وقطع الغيار،
    بينما يمكن للمستخدمين الآخرين فقط رؤية البيانات.
    """

    def has_permission(self, request, view):
        print("USER:", request.user)
        print("IS MAGASINIER:", getattr(request.user, "is_magasinier", None))
        if not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        # التحقق من صلاحية Magasinier بأمان
        return getattr(request.user, "is_magasinier", False)
