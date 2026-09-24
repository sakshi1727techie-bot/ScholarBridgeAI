from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from applications.models import Application
from notifications.models import Notification

from .models import StudentDocument

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import StudentDocumentSerializer


# ============================================================
# STUDENT DOCUMENTS HTML
# ============================================================

@login_required
def my_documents(request):

    documents = (
        StudentDocument.objects
        .filter(student=request.user)
        .select_related("application")
        .order_by("-uploaded_at")
    )

    return render(
        request,
        "documents/my_documents.html",
        {
            "documents": documents
        }
    )


# ============================================================
# STUDENT DOCUMENT UPLOAD HTML
# ============================================================

@login_required
def upload_document(request):

    if request.method == "POST":

        document_type = request.POST.get("document_type")
        document_file = request.FILES.get("document")
        application_id = request.POST.get("application_id")

        if document_type and document_file:

            application = None

            # ------------------------------------------------
            # APPLICATION IS OPTIONAL FOR OLD HTML UPLOADS
            # ------------------------------------------------

            if application_id:

                try:
                    application = Application.objects.get(
                        id=application_id,
                        student=request.user
                    )

                except Application.DoesNotExist:
                    application = None

            StudentDocument.objects.create(
                student=request.user,
                application=application,
                document_type=document_type,
                document=document_file
            )

            return redirect("my_documents")

    return render(
        request,
        "documents/upload_document.html"
    )


# ============================================================
# STUDENT DOCUMENTS API
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def documents_api(request):

    documents = (
        StudentDocument.objects
        .filter(student=request.user)
        .select_related("application")
        .order_by("-uploaded_at")
    )

    serializer = StudentDocumentSerializer(
        documents,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)


# ============================================================
# STUDENT DOCUMENT UPLOAD API
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_document_api(request):

    application_id = request.data.get("application_id")
    document_type = request.data.get("document_type")
    document_file = request.FILES.get("document")

    # --------------------------------------------------------
    # APPLICATION VALIDATION
    # --------------------------------------------------------

    if not application_id:
        return Response(
            {
                "success": False,
                "message": "Application ID is required.",
            },
            status=400,
        )

    # --------------------------------------------------------
    # FIND STUDENT APPLICATION
    # --------------------------------------------------------

    try:

        application = Application.objects.get(
            id=application_id,
            student=request.user
        )

    except Application.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": (
                    "Application not found or "
                    "you are not authorized to use it."
                ),
            },
            status=404,
        )

    # --------------------------------------------------------
    # DOCUMENT TYPE VALIDATION
    # --------------------------------------------------------

    if not document_type:

        return Response(
            {
                "success": False,
                "message": "Please select a document type.",
            },
            status=400,
        )

    # --------------------------------------------------------
    # FILE VALIDATION
    # --------------------------------------------------------

    if not document_file:

        return Response(
            {
                "success": False,
                "message": "Please select a document file.",
            },
            status=400,
        )

    # --------------------------------------------------------
    # VALID DOCUMENT TYPE
    # --------------------------------------------------------

    valid_document_types = [
        choice[0]
        for choice in StudentDocument.DOCUMENT_TYPES
    ]

    if document_type not in valid_document_types:

        return Response(
            {
                "success": False,
                "message": "Invalid document type.",
            },
            status=400,
        )

    # --------------------------------------------------------
    # CREATE DOCUMENT
    # --------------------------------------------------------

    document = StudentDocument.objects.create(
        student=request.user,
        application=application,
        document_type=document_type,
        document=document_file,
    )

    # --------------------------------------------------------
    # SERIALIZE RESPONSE
    # --------------------------------------------------------

    serializer = StudentDocumentSerializer(
        document,
        context={"request": request},
    )

    return Response(
        {
            "success": True,
            "message": "Document uploaded successfully.",
            "document": serializer.data,
        },
        status=201,
    )


# ============================================================
# ADMIN DOCUMENT MANAGEMENT API
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_documents_api(request):

    # --------------------------------------------------------
    # ADMIN ROLE CHECK
    # --------------------------------------------------------

    if getattr(request.user, "role", None) != "ADMIN":

        return Response(
            {
                "success": False,
                "message": (
                    "Only administrator users can access "
                    "document records."
                ),
            },
            status=403,
        )

    # --------------------------------------------------------
    # GET ALL STUDENT DOCUMENTS
    # --------------------------------------------------------

    documents = (
        StudentDocument.objects
        .all()
        .select_related(
            "student",
            "application",
            "application__scholarship"
        )
        .order_by("-uploaded_at")
    )

    # --------------------------------------------------------
    # FORMAT DOCUMENT DATA
    # --------------------------------------------------------

    document_list = []

    for document in documents:

        # ----------------------------------------------------
        # GET STUDENT NAME
        # ----------------------------------------------------

        student_name = ""

        if hasattr(document.student, "full_name"):

            student_name = (
                document.student.full_name or ""
            )

        if not student_name:

            student_name = (
                f"{document.student.first_name} "
                f"{document.student.last_name}"
            ).strip()

        if not student_name:

            student_name = document.student.email

        # ----------------------------------------------------
        # DOCUMENT URL
        # ----------------------------------------------------

        document_url = None

        if document.document:

            try:

                document_url = request.build_absolute_uri(
                    document.document.url
                )

            except Exception:

                document_url = None

        # ----------------------------------------------------
        # APPLICATION INFORMATION
        # ----------------------------------------------------

        application_data = None

        if document.application:

            scholarship_title = ""

            if document.application.scholarship:

                scholarship_title = (
                    document.application.scholarship.title
                )

            application_data = {
                "id": document.application.id,
                "status": document.application.status,
                "scholarship": scholarship_title,
            }

        # ----------------------------------------------------
        # ADD DOCUMENT
        # ----------------------------------------------------

        document_list.append(
            {
                "id": document.id,

                "student": {
                    "id": document.student.id,
                    "name": student_name,
                    "email": document.student.email,
                },

                "application": application_data,

                "document_type": document.document_type,

                "document_type_display": (
                    document.get_document_type_display()
                ),

                "document": (
                    document.document.name
                    if document.document
                    else None
                ),

                "document_url": document_url,

                "verification_status": (
                    document.verification_status
                ),

                "verification_status_display": (
                    document.get_verification_status_display()
                ),

                "uploaded_at": (
                    document.uploaded_at.isoformat()
                ),

                "updated_at": (
                    document.updated_at.isoformat()
                ),
            }
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "success": True,
            "count": len(document_list),
            "documents": document_list,
        },
        status=200,
    )


# ============================================================
# PROVIDER APPLICATION DOCUMENTS API
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def provider_application_documents_api(
    request,
    application_id
):

    # --------------------------------------------------------
    # PROVIDER ROLE CHECK
    # --------------------------------------------------------

    if getattr(request.user, "role", None) != "PROVIDER":

        return Response(
            {
                "success": False,
                "message": (
                    "Only provider users can access "
                    "application documents."
                ),
            },
            status=403,
        )

    # --------------------------------------------------------
    # FIND APPLICATION
    # --------------------------------------------------------

    try:

        application = (
            Application.objects
            .select_related(
                "student",
                "scholarship",
                "scholarship__provider",
            )
            .get(id=application_id)
        )

    except Application.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Application not found.",
            },
            status=404,
        )

    # --------------------------------------------------------
    # PROVIDER AUTHORIZATION
    # --------------------------------------------------------
    # Provider can only see documents belonging to
    # scholarships created by that provider.
    # --------------------------------------------------------

    scholarship_provider = (
        getattr(
            application.scholarship,
            "provider",
            None
        )
    )

    if scholarship_provider is None:

        return Response(
            {
                "success": False,
                "message": (
                    "Scholarship provider information "
                    "is not available."
                ),
            },
            status=404,
        )

    provider_user = getattr(
        scholarship_provider,
        "user",
        None
    )

    if (
        provider_user is None
        or provider_user.id != request.user.id
    ):

        return Response(
            {
                "success": False,
                "message": (
                    "You are not authorized to view "
                    "documents for this application."
                ),
            },
            status=403,
        )

    # --------------------------------------------------------
    # GET DOCUMENTS
    # --------------------------------------------------------

    documents = (
        StudentDocument.objects
        .filter(
            application=application
        )
        .select_related(
            "student",
            "application",
            "application__scholarship",
        )
        .order_by("-uploaded_at")
    )

    # --------------------------------------------------------
    # SERIALIZE DOCUMENTS
    # --------------------------------------------------------

    serializer = StudentDocumentSerializer(
        documents,
        many=True,
        context={
            "request": request
        },
    )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "success": True,

            "application": {
                "id": application.id,
                "status": application.status,
                "status_display": (
                    application.get_status_display()
                ),
            },

            "scholarship": {
                "id": application.scholarship.id,
                "title": application.scholarship.title,
            },

            "student": {
                "id": application.student.id,
                "email": application.student.email,
            },

            "count": documents.count(),

            "documents": serializer.data,
        },

        status=200,
    )


# ============================================================
# PROVIDER DOCUMENT VERIFICATION API
# ============================================================

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def provider_verify_document_api(
    request,
    document_id
):

    # --------------------------------------------------------
    # PROVIDER CHECK
    # --------------------------------------------------------

    if getattr(request.user, "role", None) != "PROVIDER":

        return Response(
            {
                "success": False,
                "message": (
                    "Only provider users can verify "
                    "student documents."
                ),
            },
            status=403,
        )

    # --------------------------------------------------------
    # DOCUMENT FETCH
    # --------------------------------------------------------

    try:

        document = (
            StudentDocument.objects
            .select_related(
                "student",
                "application",
                "application__scholarship",
                "application__scholarship__provider",
            )
            .get(id=document_id)
        )

    except StudentDocument.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Document not found.",
            },
            status=404,
        )

    # --------------------------------------------------------
    # APPLICATION CHECK
    # --------------------------------------------------------

    application = document.application

    if application is None:

        return Response(
            {
                "success": False,
                "message": (
                    "This document is not linked "
                    "to a scholarship application."
                ),
            },
            status=400,
        )

    # --------------------------------------------------------
    # PROVIDER CHECK
    # --------------------------------------------------------

    scholarship_provider = getattr(
        application.scholarship,
        "provider",
        None
    )

    if scholarship_provider is None:

        return Response(
            {
                "success": False,
                "message": (
                    "Scholarship provider information "
                    "is not available."
                ),
            },
            status=404,
        )

    provider_user = getattr(
        scholarship_provider,
        "user",
        None
    )

    if (
        provider_user is None
        or provider_user.id != request.user.id
    ):

        return Response(
            {
                "success": False,
                "message": (
                    "You are not authorized to verify "
                    "this document."
                ),
            },
            status=403,
        )

    # --------------------------------------------------------
    # STATUS
    # --------------------------------------------------------

    verification_status = request.data.get(
        "verification_status"
    )

    allowed_statuses = [
        "VERIFIED",
        "REJECTED",
        "PENDING",
    ]

    if verification_status not in allowed_statuses:

        return Response(
            {
                "success": False,
                "message": (
                    "Invalid verification status. "
                    "Use VERIFIED, REJECTED or PENDING."
                ),
            },
            status=400,
        )

    # --------------------------------------------------------
    # UPDATE DOCUMENT
    # --------------------------------------------------------

    document.verification_status = verification_status

    document.save(
        update_fields=[
            "verification_status",
            "updated_at",
        ]
    )

    # ========================================================
    # STUDENT NOTIFICATION
    # ========================================================

    student = document.student
    scholarship = application.scholarship

    # --------------------------------------------------------
    # VERIFIED NOTIFICATION
    # --------------------------------------------------------

    if verification_status == "VERIFIED":

        Notification.objects.create(
            user=student,
            title="Document Verified",
            message=(
                f"Your "
                f"{document.get_document_type_display()} "
                f"has been verified by the scholarship "
                f"provider for "
                f"'{scholarship.title}'."
            ),
            type="DOCUMENT",
        )

    # --------------------------------------------------------
    # REJECTED NOTIFICATION
    # --------------------------------------------------------

    elif verification_status == "REJECTED":

        Notification.objects.create(
            user=student,
            title="Document Rejected",
            message=(
                f"Your "
                f"{document.get_document_type_display()} "
                f"has been rejected by the scholarship "
                f"provider for "
                f"'{scholarship.title}'. "
                f"Please upload a valid document."
            ),
            type="DOCUMENT",
        )

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return Response(
        {
            "success": True,
            "message": (
                "Document verification status "
                "updated successfully."
            ),
            "document": {
                "id": document.id,
                "verification_status": (
                    document.verification_status
                ),
                "verification_status_display": (
                    document.get_verification_status_display()
                ),
            },
        },
        status=200,
    )