from django.forms import ValidationError
from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth import authenticate, login
from .permissions import IsAdminOrCanViewSpecificUsers
from .models import Utilisateur, Magasinier, Operateur, Administrateur, Responsable, Technicien,Company
from .serializers import UtilisateurSerializer, MagasinierSerializer, OperateurSerializer, AdministrateurSerializer, ResponsableSerializer, TechnicienSerializer,CompanySerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.views import TokenObtainPairView


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAdminOrCanViewSpecificUsers]  # السماح لأي شخص بإنشاء مستخدم
    parser_classes = (MultiPartParser, FormParser)
    def get_queryset(self):
        user = self.request.user

        if user.is_admin:
            return Utilisateur.objects.all()

        if user.is_responsable:
            return Utilisateur.objects.filter(role__in=['magasinier', 'operateur', 'technicien'])

        return Utilisateur.objects.filter(id=user.id)  # المستخدم يرى بياناته فقط

    def create(self, request, *args, **kwargs):
        """
        أي شخص يمكنه إنشاء مستخدم جديد.
        """
        data = request.data.copy()
        print("Received numidentif:", data)
        
        try:
            company_record = Company.objects.get(numidentifuc=data.get("numidentif"))
        except Company.DoesNotExist:
            print("Company not found!")
            return Response({"error": "Aucune entreprise correspondante trouvée."}, status=status.HTTP_400_BAD_REQUEST)

        # التحقق من تطابق البيانات
        if data.get("first_name") != company_record.nomuc or \
           data.get("last_name") != company_record.prenomuc or \
           str(data.get("numidentif")) != str(company_record.numidentifuc):
            print("Mismatch in company information!")
            return Response({"error": "Les informations ne correspondent pas à celles de l'entreprise."}, status=status.HTTP_400_BAD_REQUEST)
        data["username"] = data.get("first_name") + " " + data.get("last_name")
        if 'role' not in data:
            return Response({'role': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=data)
    
        if not serializer.is_valid():
            print(serializer.errors)  # طباعة الأخطاء في الـ console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        user = serializer.save()
        user.set_password(data["password"])  # تشفير كلمة المرور
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class MagasinierViewSet(viewsets.ModelViewSet):
    queryset = Magasinier.objects.all()
    serializer_class = MagasinierSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]

class OperateurViewSet(viewsets.ModelViewSet):
    queryset = Operateur.objects.all()
    serializer_class = OperateurSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]

class AdministrateurViewSet(viewsets.ModelViewSet):
    queryset = Administrateur.objects.all()
    serializer_class = AdministrateurSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]

class ResponsableViewSet(viewsets.ModelViewSet):
    queryset = Responsable.objects.all()
    serializer_class = ResponsableSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]

class TechnicienViewSet(viewsets.ModelViewSet):
    queryset = Technicien.objects.all()
    serializer_class = TechnicienSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]
    
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrCanViewSpecificUsers]
    


User = get_user_model()

class LoginView(APIView): 
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise ValidationError("Invalid password")
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            'access': access_token,
            'refresh': str(refresh),
        })

        # تخزين التوكنات في HTTP-only cookies
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            max_age=60 * 60,  # ساعة
            secure=True,
            samesite='None',
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            max_age=60 * 60 * 24 * 7,  # أسبوع
            secure=True,
            samesite='None', 
        )

        return response


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        print("User view accessed")
        print("User:", request.user)  # التحقق من المستخدم
        user = request.user
        return Response({
            "username": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "image": request.build_absolute_uri(user.image.url) if user.image else None,
            "user": str(request.user)
        })

# views.py
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response({"detail": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')  # حذف الكوكيز
        return response

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "This is a protected route"})
    
class StatusAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        
        return Response({
            "authenticated": True,
            "user": {
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "role": request.user.role,
            "image": request.build_absolute_uri(request.user.image.url) if request.user.image else None
            }
        })
    
