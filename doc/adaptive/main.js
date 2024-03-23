// Sample code for Adaptive Integration (CCDS). Check the documentation for more information.
// GitHub: https://github.com/f5serge/fn-devcontainer-oauth.git

'use strict';
import { ai } from '/Script/Source/Integration2/CustomCloudScripts/CustomCloudScriptApi.js';

function testConnection(context) {
  const token = API.getToken(context);
  ai.log.logInfo('Test Connection', token ? `Succeeded [${token}]` : 'Failed');
  return res ? true : false;
}

function ping(context) {
  const res = API.ping(context);
  ai.log.logInfo('Ping', res ? `${res}` : 'Failed');
  return res
}

const API = {
  getToken: (context) => {
    const dataSource = context.getDataSource();
    const tenantId = dataSource.getSetting('tenant-id').getValue();
    const clientId = dataSource.getSetting('client-id').getValue();
    const clientSecret = dataSource.getSetting('client-secret').getValue();
    const { url, method, body, headers } = Configuration.auth(tenantId, clientId, clientSecret);
    let response;
    try {
      response = ai.https.request(url, method, body, headers);
      const responseCode = response ? response.getHttpCode() : 500;

      if (responseCode !== 200) {
        throw Error(`responseCode: ${responseCode}. ${response.getBody()}`);
      }

      const res = JSON.parse(response.getBody());
      ai.log.logVerbose('Auth Succeeded', responseCode);
      return res.access_token;
    } catch (error) {
      ai.log.logError('HTTPs request failed', '' + JSON.stringify(error.message));
      response && ai.log.logError('HTTPs request failed', 'Response: ' + response.getBody());
    }
  },
  
  ping: (context) => {
    const dataSource = context.getDataSource();
    const token = API.getToken(context);
    const functionName = dataSource.getSetting('function-name').getValue();

    ai.log.logInfo('Auth Connection', JSON.stringify(token));
    const { url, method, body, headers } = Configuration.ping(token, functionName);
    let response;
    try {
      ai.log.logInfo('Auth Connection', JSON.stringify({ url, method, body, headers }));
      response = ai.https.request(url, method, body, headers);
      const responseCode = response ? response.getHttpCode() : 500;

      if (responseCode !== 200) {
        throw Error(`responseCode: ${responseCode}. ${JSON.stringify(response.getBody())}`);
      }

      const res = JSON.parse(response.getBody());
      ai.log.logVerbose('Auth Succeeded', responseCode);
      return res;
    } catch (error) {
      ai.log.logError('HTTPs request failed', '' + JSON.stringify(error.message));
      response && ai.log.logError('HTTPs request failed', 'Response: ' + response.getBody());
    }
  }
};

const Configuration = {
  auth: (tenantId, clientId, clientSecret) => {
    const form = {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: `api://${clientId}/.default`
    };
    let formBody = [];
    for (const property in form) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(form[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return {
      method: 'POST',
      url: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: formBody,
    };
  },
  ping: (token, functionName) => {
    return {
      method: 'GET',
      url: `https://${functionName}.azurewebsites.net/api/ping`,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: ``
    };
  }
};