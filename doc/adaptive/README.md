# Azure Function Connector for Workday Adaptive Insights

This connector allows you to interact with Azure Functions from Workday Adaptive Insights. It provides the following operations:

- getToken: Get an OAuth2 token from Azure Active Directory.
- ping: Test the connection to the Azure Function.

## Prerequisites

- Azure Function with OAuth2 authentication using Azure Active Directory (AAD).
- Workday Adaptive Insights account.

## Installation

1. Create a new custom integration in Adaptive Insights.
2. Add the following parameters to the custom integration:
   - `tenant-id`: Azure Tenant ID.
   - `client-id`: Azure Function App Client ID.
   - `client-secret`: Azure Function App Client Secret.
   - `function-name`: Azure Function Name.

Update the `tenant-id`, `client-id`, and `client-secret` variables with your Azure Tenant and Function App Client ID and Secret (see [README.md](../../README.md) for more information).

![adaptive-params](/doc/.attachments/adaptive-params.png)

3. Open the `main.js` file and copy the code to your Adaptive Insights CCDS script.

## Test

- Test the API connection by running the `Test Connection` action in the custom integration menu. It should return a successful response and show access_token in the log output.

Now you can use the Azure Function Connector in your Adaptive Insights custom integration. Refer to the `ping` function in the `main.js` file for more information.





