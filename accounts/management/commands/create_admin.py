import os

from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Create or update the Admin user from environment variables"

    def handle(self, *args, **options):
        email = os.getenv("ADMIN_EMAIL")
        password = os.getenv("ADMIN_PASSWORD")

        if not email or not password:
            self.stdout.write(
                self.style.ERROR(
                    "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required."
                )
            )
            return

        user, created = User.objects.get_or_create(
            email=email.strip().lower()
        )

        user.set_password(password)
        user.role = "ADMIN"
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS("Admin user created successfully.")
            )
        else:
            self.stdout.write(
                self.style.SUCCESS("Admin user updated successfully.")
            )