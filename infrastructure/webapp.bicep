@description('Base name of the resource such as web app name and app service plan ')
@minLength(2)
param webAppName string = 'pipelineinvaders'

@description('The SKU of App Service Plan ')
param sku string = 'F1'

@description('Location for all resources.')
param location string = resourceGroup().location

@description('Docker Registry Server URL')
param dockerRegistryUrl string

@description('Docker Registry Username (GitHub repository owner)')
param dockerRegistryUsername string

@secure()
@description('Docker Registry Personal Access Token')
param dockerRegistryPassword string

@description('Docker image tag (e.g. myrepo/myapp:latest)')
param dockerImage string = 'nginx:latest'

var webAppPortalName = '${webAppName}-webapp'
var appServicePlanName = 'AppServicePlan-${webAppName}'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppPortalName
  location: location
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: ''  // Use container settings instead
      webSocketsEnabled: true
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: dockerRegistryUrl
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: dockerRegistryUsername
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: dockerRegistryPassword
        }
        {
          name: 'DOCKER_CUSTOM_IMAGE_NAME'
          value: dockerImage
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'  // For containerized apps, set this to false
        }
      ]
    }
  }
}

resource slotStaging 'Microsoft.Web/sites/slots@2022-09-01' = {
  parent: webApp
  name: 'staging'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    // No need to redefine Docker settings here, it inherits from the main app
  }
}

resource slotTesting 'Microsoft.Web/sites/slots@2022-09-01' = {
  parent: webApp
  name: 'testing'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    // No need to redefine Docker settings here, it inherits from the main app
  }
}
