# Stage 1: Base image for runtime (ASP.NET Core)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Stage 2: Build stage (Install Node.js, Restore, Build .NET & TypeScript)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Copy backend project file and restore
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "./backend/backend.csproj"

# Copy entire project
COPY . .

# Build TypeScript frontend
WORKDIR /src/frontend
RUN npm install
RUN npm run build

# Build .NET backend
WORKDIR /src/backend
RUN dotnet build "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish stage (Publish .NET backend)
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final stage (Runtime)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
