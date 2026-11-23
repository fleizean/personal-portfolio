# syntax=docker/dockerfile:1

# --- build: önce yalnızca proje dosyalarıyla restore (katman önbelleklenir), sonra publish ---
FROM mcr.microsoft.com/dotnet/sdk:11.0-alpine AS build
WORKDIR /src
COPY nuget.config global.json Directory.Build.props Directory.Packages.props .editorconfig ./
COPY src/Core/Portfolio.Domain/Portfolio.Domain.csproj src/Core/Portfolio.Domain/
COPY src/Core/Portfolio.Application/Portfolio.Application.csproj src/Core/Portfolio.Application/
COPY src/Infrastructure/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj src/Infrastructure/Portfolio.Infrastructure/
COPY src/Infrastructure/Portfolio.Persistence/Portfolio.Persistence.csproj src/Infrastructure/Portfolio.Persistence/
COPY src/Presentation/Portfolio.WebAPI/Portfolio.WebAPI.csproj src/Presentation/Portfolio.WebAPI/
RUN dotnet restore src/Presentation/Portfolio.WebAPI/Portfolio.WebAPI.csproj
COPY src/ src/
RUN dotnet publish src/Presentation/Portfolio.WebAPI -c Release -o /app --no-restore

# --- run: yalnızca ASP.NET çalışma zamanı, root olmayan kullanıcı ---
FROM mcr.microsoft.com/dotnet/aspnet:11.0-alpine
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_HTTP_PORTS=8080 \
    UPLOADS_DIR=/data/uploads \
    DATA_PROTECTION_DIR=/data/keys
COPY --from=build /app .
# Yüklenen görseller ve oturum anahtarları volume'da; klasörler uygulama kullanıcısına ait
RUN mkdir -p /data/uploads /data/keys && chown -R $APP_UID /data
USER $APP_UID
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:8080/api/health || exit 1
ENTRYPOINT ["dotnet", "Portfolio.WebAPI.dll"]
