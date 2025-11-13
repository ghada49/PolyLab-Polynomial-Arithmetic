
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .middleware.security_headers import SecurityHeadersMiddleware
from .core.ratelimit import rate_limit
from .core.csrf import csrf_protect
from .api.routers import auth, mfa, roles, instructor_requests

app = FastAPI(title="Auth API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# Security headers
app.add_middleware(SecurityHeadersMiddleware)

# Global middlewares
@app.middleware("http")
async def _rate_limit(request, call_next):
    await rate_limit(request)
    return await call_next(request)

@app.middleware("http")
async def _csrf(request, call_next):
    # Skip CSRF for GET/HEAD/OPTIONS and auth/csrf endpoint
    if request.method in ("GET","HEAD","OPTIONS") or request.url.path.endswith("/auth/csrf"):
        return await call_next(request)
    # Allow login and verify/reset to proceed without CSRF if no session yet
    if request.url.path.startswith("/auth/login") \
        or request.url.path.startswith("/auth/signup") \
        or request.url.path.startswith("/auth/verify-email") \
        or request.url.path.startswith("/auth/reset"):
        return await call_next(request)
    from .core.csrf import csrf_protect
    csrf_protect(request)
    return await call_next(request)

# Routers
app.include_router(auth.router)
app.include_router(mfa.router)
app.include_router(roles.router)
app.include_router(instructor_requests.router)
