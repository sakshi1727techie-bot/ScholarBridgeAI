from django.urls import path

from .views import (
    my_documents,
    upload_document,
    documents_api,
    upload_document_api,
    admin_documents_api,
    provider_application_documents_api,
    provider_verify_document_api,
)


urlpatterns = [

    # ============================================================
    # STUDENT DOCUMENTS HTML
    # ============================================================

    path(
        "",
        my_documents,
        name="my_documents"
    ),

    # ============================================================
    # STUDENT DOCUMENT UPLOAD HTML
    # ============================================================

    path(
        "upload/",
        upload_document,
        name="upload_document"
    ),

    # ============================================================
    # STUDENT DOCUMENTS API
    # ============================================================

    path(
        "api/",
        documents_api,
        name="documents_api"
    ),

    # ============================================================
    # STUDENT DOCUMENT UPLOAD API
    # ============================================================

    path(
        "api/upload/",
        upload_document_api,
        name="upload_document_api"
    ),

    # ============================================================
    # ADMIN DOCUMENT MANAGEMENT API
    # ============================================================

    path(
        "api/admin/",
        admin_documents_api,
        name="admin_documents_api"
    ),

    # ============================================================
    # PROVIDER APPLICATION DOCUMENTS API
    # ============================================================

    path(
        "api/provider/application/<int:application_id>/documents/",
        provider_application_documents_api,
        name="provider_application_documents_api"
    ),

    # ============================================================
    # PROVIDER DOCUMENT VERIFICATION API
    # ============================================================

    path(
        "api/provider/document/<int:document_id>/verify/",
        provider_verify_document_api,
        name="provider_verify_document_api"
    ),
]