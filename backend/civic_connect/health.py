from django.http import JsonResponse

def health_check(request):
    """Simple health check endpoint for deployment verification."""
    return JsonResponse({"status": "ok"})
