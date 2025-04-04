from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import action
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
    



class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        print("Received email:", email)

        user = get_object_or_404(Utilisateur, email=email)

        if not check_password(password, user.password):
            print("Incorrect password")
            return Response({"error": "كلمة المرور غير صحيحة"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username,
            "image": request.build_absolute_uri(user.image.url) if user.image else None
        })


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

