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

![vscode-create-function-app](/doc/.attachments/vscode-create-function-app.png)

### Deploy Azure Function

To deploy the Azure Function, open `Azure` tab in your VS Code,
click on the function logo in the `Workspace` view and select `Deploy to Function App...`. Then follow the instructions to deploy the Function in your Azure subscription.

![vscode-deploy-function-app](/doc/.attachments/vscode-deploy-function-app.png)

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

## Test OAuth2 Authentication 

### Create an application registration for the client application

-   From the portal menu, select **Microsoft Entra ID**.
-   From the left navigation, select **App registrations** > **New registration**.
-   In the **Register an application** page, enter a **Name** for your app registration.
-   For a daemon application, you don't need a Redirect URI so you can keep that empty.
-   Select **Register**.
-   After the app registration is created, copy the value of **Application (client) ID**.
-   From the left navigation, select **Certificates & secrets** > **Client secrets** > **New client secret**.
-   Enter a description and expiration and select **Add**.
-   In the **Value** field, copy the client secret value. It won't be shown again once you navigate away from this page.

### Test the OAuth2 authentication 

Open up a browser, I’d recommend in incognito/in-private mode. We now need to build up a specific URL to call MS Identity and authenticate. All of the below should be on one line, but has been broken over multiple lines so it is easier to read.

```sh
https://login.microsoftonline.com/<Tenant ID>/oauth2/v2.0/authorize
    ?client_id=<Client ID>
    &response_type=code
    &redirect_uri=<Redirect URL>
    &response_mode=fragment
    &scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fuser.read
    &state=12345
```

Once you have the URL, paste it into the browser and hit enter. You will be redirected to the Microsoft login page. Enter your credentials and sign in. You will then be redirected to the Azure Function. After successful authentication, you will be able to execute the Azure Function. 


```json
{
    "message": "Hello, <User Name>!"
}
```


## Sample Client Application

You can use the following sample client application to test the OAuth2 authentication.

### Get an access token

```js
const fetch = require('node-fetch');
const tenantId = '<Tenant ID>';
const clientId = '<Client ID>';
const clientSecret = '<Client Secret>';

const form = {
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
  scope: 'api://<Application ID>/.default'
};

let formBody = [];
for (const property in form) {
  const encodedKey = encodeURIComponent(property);
  const encodedValue = encodeURIComponent(form[property]);
  formBody.push(encodedKey + '=' + encodedValue);
}

formBody = formBody.join('&');

const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  body: formBody
});

const data = await response.json();
const token = data.access_token;
console.log(token);
```


### Call the Azure Function

```js
const fetch = require('node-fetch');
const token = '<Access Token>';

const response = await fetch('https://<Function App Name>.azurewebsites.net/api/<Function Name>', {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` }
});

const data = await response.json();
console.log(data);
```



## References

- [Authentication and authorization in Azure App Service and Azure Functions](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- [Configure authentication provider in Azure App Service](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad?tabs=workforce-tenant)
- [Add OAuth2 implicit flow to Azure Function](https://blog.powney.info/2019/05/add-oauth-implicit-flow-to-azure-function)


