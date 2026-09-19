from django.urls import path

from .views import (
    my_documents,
    upload_document,
    documents_api,
)


urlpatterns = [
    path("", my_documents, name="my_documents"),
    path("upload/", upload_document, name="upload_document"),
    path("api/", documents_api, name="documents_api"),
]