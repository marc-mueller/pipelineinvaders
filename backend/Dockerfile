#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
WORKDIR /src
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "./backend/backend.csproj"
COPY ["frontend/package.json", "frontend/"]
WORKDIR /src/frontend
RUN npm install
WORKDIR /src
COPY . .
RUN dotnet build "./backend/backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS test
ARG BUILDID=localbuild
LABEL testresults=${BUILDID}

# Run Jest tests
WORKDIR /src/frontend
RUN npm test

# Run xUnit tests
WORKDIR /src
RUN dotnet test "./backend.Tests/backend.Tests.csproj" --logger:trx --results-directory /testresults --logger "trx;LogFileName=test_results.trx" /p:CollectCoverage=true /p:CoverletOutputFormat=json%2cCobertura /p:CoverletOutput=/testresults/coverage/ -p:MergeWith=/testresults/coverage/coverage.json

# Copy test results to a specific directory
RUN mkdir -p /testresults/jest /testresults/xunit
RUN cp -r /src/frontend/coverage /testresults/jest
RUN cp -r /testresults /testresults/xunit

FROM test AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./backend/backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

#FROM base AS final
FROM mcr.microsoft.com/dotnet/aspnet:8.0-noble-chiseled AS final
EXPOSE 8080
EXPOSE 8081
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]
