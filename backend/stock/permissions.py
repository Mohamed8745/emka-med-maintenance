from rest_framework import permissions

class IsMagasinierOrReadOnly(permissions.BasePermission):
    """
    السماح فقط لـ Magasinier بإدارة المخزون وقطع الغيار،
    بينما يمكن للمستخدمين الآخرين فقط رؤية البيانات.
    """

    def has_permission(self, request, view):
        # السماح فقط إذا كان المستخدم مسجلاً دخوله
        if not request.user.is_authenticated:
            return False

        # السماح بالعرض فقط للمستخدمين العاديين
        if request.method in permissions.SAFE_METHODS:
            return True

        # السماح لـ Magasinier بإدارة المخزون وقطع الغيار
        return request.user.is_magasinier
