from rest_framework import permissions
from users.models import Magasinier, Operateur, Technicien

class IsAdminOrCanViewSpecificUsers(permissions.BasePermission):
    """
    صلاحيات الوصول:
    - أي شخص (حتى الزوار) يمكنه إنشاء مستخدم (POST).
    - المستخدمون المسجلون:
        * admin: له جميع الصلاحيات.
        * responsable: يمكنه رؤية Magasinier, Operateur, Technicien.
        * المستخدم العادي: يمكنه رؤية أو تعديل بياناته فقط.
    """

    def has_permission(self, request, view):
        # السماح للجميع (حتى غير المسجلين) بإنشاء حساب جديد
        if request.method == "POST":
            return True

        # رفض الطلبات الأخرى للمستخدمين غير المصادق عليهم
        if not request.user.is_authenticated:
            return False

        # admin له كامل الصلاحيات
        if request.user.is_admin:
            return True

        # السماح لجميع المستخدمين بالطلبات الآمنة مثل GET وOPTIONS
        if request.method in permissions.SAFE_METHODS:
            return True

        # السماح للمستخدم المصادق عليه بمتابعة الطلب
        # (سيتم التحقق من الصلاحية الحقيقية في has_object_permission)
        return True

    def has_object_permission(self, request, view, obj):
        # admin له كامل الصلاحيات
        if request.user.is_admin:
            return True

        # responsable يمكنه رؤية مستخدمين معينين فقط
        if request.user.is_responsable and request.method in permissions.SAFE_METHODS:
            return isinstance(obj, (Magasinier, Operateur, Technicien))

        # السماح للمستخدم فقط بالوصول إلى وتعديل بياناته الشخصية
        return obj == request.user
