from rest_framework import permissions


class IsAdminOrSuperAdmin(permissions.BasePermission):
    """Allows access only to admin / super_admin roles for write operations."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role in (
            'admin', 'super_admin'
        )


class IsTreasurerOrAdmin(permissions.BasePermission):
    """Allows finance write access to treasurer/admin/super_admin roles."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role in (
            'treasurer', 'admin', 'super_admin'
        )
