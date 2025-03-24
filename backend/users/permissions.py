from rest_framework import permissions
from users.models import Magasinier, Operateur, Technicien

class IsAdminOrCanViewSpecificUsers(permissions.BasePermission):
    """
    - أي شخص (حتى الزوار) يمكنهم إضافة مستخدم جديد.
    - Administrateur لديه جميع الصلاحيات.
    - Responsable يمكنه رؤية (Magasinier, Operateur, Technicien) فقط.
    - كل مستخدم يمكنه رؤية بياناته الشخصية وتعديلها.
    """

    def has_permission(self, request, view):
        if request.method == "POST":
            return True  # السماح لأي شخص بإنشاء مستخدم جديد

        if not request.user.is_authenticated:
            return False  # رفض الوصول للمستخدم غير المصادق في العمليات الأخرى

        if request.user.is_admin:
            return True  # Admin لديه جميع الصلاحيات

        if request.method in permissions.SAFE_METHODS:
            return True  # السماح بالطلبات الآمنة (GET, HEAD, OPTIONS) للجميع

        return False  # رفض أي تعديل أو حذف للمستخدمين غير الإداريين

    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True  # Admin لديه جميع الصلاحيات

        if request.user.is_responsable and isinstance(obj, (Magasinier, Operateur, Technicien)):
            return True  # Responsable يمكنه رؤية Magasinier, Operateur, Technicien فقط

        return obj == request.user  # السماح للمستخدم برؤية بياناته فقط
