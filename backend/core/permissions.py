from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Permission check ensuring the requesting user is authenticated, active,
    and is the designated owner (superuser or staff account).
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_active
            and (request.user.is_superuser or request.user.is_staff)
        )
