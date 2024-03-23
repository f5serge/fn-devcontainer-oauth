---
Title: Securing Azure Functions with OAuth2 Authentication
Description: Learn how to secure your Azure Functions with OAuth2 authentication using Azure Active Directory (AAD).
Tags: azure, azure-functions, oauth2, authentication, aad, security
Date: 2024-03-23
Last Updated: 2024-03-24
---

# Securing Azure Functions with OAuth2 Authentication

## Introduction

In this blog post, we will explore how to create an Azure Function with an HTTP trigger and OAuth2 authentication using Azure Active Directory (AAD). We will also create a sample client app that authenticates and executes the function. This solution will help you understand how to secure your Azure Functions using OAuth2 authentication.

## 1. Creating and Deploying an Azure Function using DevContainer in VSCode

Before we dive into the details of OAuth2 authentication, let's first create and deploy a simple Azure Function using a DevContainer in Visual Studio Code (VSCode).

### Introduction

Azure Functions are a great way to build serverless applications that can scale on demand. In this section, we will create an Azure Function with an HTTP trigger and deploy it using a DevContainer in Visual Studio Code (VSCode).

### Prerequisites

Before we get started, make sure you have the following prerequisites installed on your machine:

- [Dev Container: Azure Functions (Node.js)](https://code.visualstudio.com/docs/devcontainers/containers)

### Installation

To create and run the Azure Function, follow these steps:

1. Clone this repository.
2. Open the repository in Visual Studio Code.
3. Reopen the repository in the Dev Container.
4. Run the following command to install the dependencies.

```bash
npm install
```

5. Start the Azure Function by running the following command.

```bash
npm start
```

6. Open your browser and navigate to `http://localhost:7071/api/ping`. You should see a standard "Hello, World!" message.

7. Create the Azure Function resource in Azure by right-clicking on the `Function App` group in the `Azure` resources view and selecting `Create Function App in Azure...`. Follow the instructions to create the Function in your Azure subscription.

8. After successful creation, you can deploy the Azure Function to Azure by clicking on the `Azure` tab in your VSCode and selecting the function logo in the `Workspace` view. Then click on `Deploy to Function App...` and follow the instructions to deploy the Function in your Azure subscription.

9. After successful deployment, you can access the Azure Function in the Azure portal.

Make sure to test the Azure Function by navigating to the URL provided in the Azure portal. You should see the same "Hello, World!" message as before.


## 2. Configuring the Azure Function to use Azure Active Directory (AAD) OAuth2

Now that we have created and deployed the Azure Function, let's configure it to use Azure Active Directory (AAD) OAuth2 for authentication.

### Introduction to AAD OAuth2

Azure Active Directory (AAD) OAuth2 is a secure way to authenticate users and authorize access to your applications. In this section, we will configure the Azure Function to use AAD OAuth2 for authentication.

### Configuring AAD OAuth2 for the Azure Function

To configure AAD OAuth2 authentication for the Azure Function, follow these steps:

1. Open the Azure portal.
2. Navigate to the Azure Function App that you have created.
3. In the `Settings` section, click on `Authentication` and then click on `Add identity provider`.
4. In the `Choose a tenant for your application and its users` section, select `Workforce configuration (current tenant)`.
5. In the `App registration` section, you can either create a new app registration or select an existing app registration. If you want to create a new app registration, you can specify the app `Name`, and select the `Supported account types` as `Current tenant - Single tenant`.
6. In the `App Service authentication settings` section, make sure that the `Restrict access` is set to `Require authentication`.
7. In the `Unauthenticated requests` section, select `HTTP 401 Unauthorized: recommended for APIs`.
8. Click Next and then click Add.

Here's a screenshot of the AAD OAuth2 configuration in the Azure portal:

![alt text](/doc/.attachments/az-fn-authentication.png)

After configuring AAD OAuth2 authentication, you can test the Azure Function by navigating to the URL provided in the Azure portal. As far as we selected to return 401 for unauthenticated requests, you should see an HTTP 401 Unauthorized response when accessing the Function URL without authentication.

![alt text](/doc/.attachments/web-fn-401.png)



## 3. Creating a Sample Client App that Authenticates and Executes the Function

Now that we have configured the Azure Function to use AAD OAuth2, let's create a sample client app that authenticates and executes the function.

### Designing the Client App

The client app will be a simple Node.js application that authenticates with AAD OAuth2 and calls the Azure Function.

### Implementing Authentication

To implement authentication in the client app, follow these steps:

```javascript
const axios = require('axios');

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tenantId = 'YOUR_TENANT_ID';
const functionUrl = 'YOUR_FUNCTION_URL';

const getToken = async () => {
  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await axios.post(tokenEndpoint, {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: `api://${clientId}/.default`,
  });

  return response.data.access_token;
};

const callFunction = async () => {
  const token = await getToken();

  const response = await axios.get(functionUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.data);
};

callFunction();
```

Replace the placeholders `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, `YOUR_TENANT_ID`, `YOUR_RESOURCE_NAME`, and `YOUR_FUNCTION_URL` with your actual values.

In this code snippet, we are using the `axios` library to make HTTP requests to authenticate with AAD OAuth2 and call the Azure Function.

## Conclusion

In this blog post, we explored how to create an Azure Function with OAuth2 authentication using Azure Active Directory (AAD). We also created a sample client app that authenticates and executes the function. This solution will help you secure your Azure Functions and build secure serverless applications. For more details, you can refer to the [GitHub repository](https://github.com/f5serge/fn-devcontainer-oauth.git)


