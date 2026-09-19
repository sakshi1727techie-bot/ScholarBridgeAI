from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .models import StudentDocument

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import StudentDocumentSerializer


@login_required
def my_documents(request):

    documents = StudentDocument.objects.filter(
        student=request.user
    ).order_by("-uploaded_at")

    return render(
        request,
        "documents/my_documents.html",
        {
            "documents": documents
        }
    )


@login_required
def upload_document(request):

    if request.method == "POST":

        document_type = request.POST.get("document_type")
        document_file = request.FILES.get("document")

        if document_type and document_file:

            StudentDocument.objects.create(
                student=request.user,
                document_type=document_type,
                document=document_file
            )

            return redirect("my_documents")

    return render(
        request,
        "documents/upload_document.html"
    )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import StudentDocumentSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def documents_api(request):

    documents = StudentDocument.objects.filter(
        student=request.user
    ).order_by("-uploaded_at")

    serializer = StudentDocumentSerializer(
        documents,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)