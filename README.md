# Azure Function v4 with TypeScript (OAuth2 authentication)

This sample project demonstrates how to create an Azure Function with an HTTP trigger and OAuth2 authentication using Azure Active Directory (AAD).

## Overview

When functions use an HTTP trigger, you can require calls to first be authenticated. Azure Functions supports multiple authentication providers, including Azure Active Directory (Azure AD), Facebook, Google, Twitter, and Microsoft Account. You can also use custom authentication providers. 



## Local Development

### Prerequisites

- [Dev Container: Azure Functions (Node.js)](https://code.visualstudio.com/docs/devcontainers/containers)

### Setup

1. Clone this repository.
2. Open the repository in Visual Studio Code.
3. Reopen the repository in the Dev Container.
4. Run the following command to install the dependencies.

```bash
npm install
```

### Run

1. Run the following command to start the Azure Function.

```bash
npm start
```

## Deployment

### Create Azure Function App

The default Dev Container in VS Code is configured to deploy the Azure Functions to Azure. 

To deploy the Azure Function, right-click on the `Function App` group in the `Azure` resources view and select `Create Function App in Azure...`. Then follow the instructions to deploy the Function in your Azure subscription.

![alt text](/doc/.attachments/vscode-create-function-app.png)

### Deploy Azure Function

To deploy the Azure Function, open `Azure` tab in your VS Code,
click on the function logo in the `Workspace` view and select `Deploy to Function App...`. Then follow the instructions to deploy the Function in your Azure subscription.

![alt text](/doc/.attachments/vscode-deploy-function-app.png)

After successful deployment, you can access the Azure Function in the Azure portal. 

## Configure OAuth2 Authentication

To configure OAuth2 authentication, you need to create an OAuth2 application in the Azure Active Directory (AAD) and configure the Azure Function to use the AAD application.

### Create OAuth2 Application

1. Open the Azure portal.
2. Navigate to the Azure Function App that you have created.
3. In the `Settings` section, click on `Authentication` and then click on `Add identity provider`.
4. In the `Choose a tenant for your application and its users` section, select `Workforce configuration (current tenant)`.
5. In the `App registration` section, you can either create a new app registration or select an existing app registration. If you want to create a new app registration, you can specify the app `Name`, and select the `Supported account types` as `Current tenant - Single tenant`.
6. In the `App Service authentication settings` section, make sure that the `Restrict access` is set to `Require authentication`.
7. In the `Unauthenticated requests` section, select `HTTP 401 Unauthorized: recommended for APIs`.
8. Click Next and then click Add.

## References

- [Authentication and authorization in Azure App Service and Azure Functions](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- [Configure authentication provider in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad?tabs=workforce-tenant)

