import fs from 'fs'
import { APIMethod } from '../../../types/index'
import { getTSDataType } from './DTOGenerator'

export function createCommunicatorFile(outFile: string) {
  const contents = `using System;
using System.Collections;
using System.Collections.Generic;
using Openworld.Models;
using Proyecto26;
using UnityEngine;

namespace Openworld
{
  public class Communicator : MonoBehaviour
  {

    private const string prodUrl = "https://www.openworld-game.com";
    private const string devUrl = "http://localhost:3001";
    [SerializeField] public string baseUrl = prodUrl;
    [SerializeField] public string apiPath = "/api/v1";
    protected GameManager gameManager;

    protected void Start()
    {
      gameManager = FindObjectOfType<GameManager>();
    }

    public void SetIsDevUrl(bool isDevUrl)
    {
      baseUrl = isDevUrl ? devUrl : prodUrl;
    }

    private RequestHelper getBasicRequest(string path)
    {
      string url = baseUrl + apiPath + path;
      return new RequestHelper
      {
        Uri = url,
        EnableDebug = gameManager.debugApi
      };
    }

    private RequestHelper getAuthorizedRequest(string path)
    {
      RequestHelper req = getBasicRequest(path);
      var headers = new Dictionary<string, string>();
      headers.Add("Authorization", "Bearer " + gameManager.GetAuthToken());
      req.Headers = headers;
      return req;
    }

    private void HandleError(Exception err, Action<RequestException> handler)
    {
      handler((RequestException)err);
    }

// BEGIN ROUTE METHODS
  }
}`
  fs.writeFileSync(outFile, contents)
}

export function buildRequestMap(api: any) {
  const map = {}
  for (const reqName in api.components.requestBodies) {
    const req = api.components.requestBodies[reqName]
    const schema = req.content['application/json'].schema
    const properties = schema.properties
    const fields = {}

    for (const fieldName in properties) {
      const type = getTSDataType(properties[fieldName])
      fields[fieldName] = type.type
      if (type.array) fields[fieldName] += '[]'
    }
    map[reqName] = fields
  }
  return map
}

export function makeMethod(header: string, methodName: string, method: APIMethod, reqMap: any): string {
  const typeMap = { number: 'int' }
  const secure = method.security === undefined || method.security.length > 0
  const req = method.requestObject
  const reqShort = req?.replace('Request', '')
  const reqFields = reqMap[reqShort]
  const res = method.responseObject
  const path = method.path
  const pathParseRegex = /{(.*?)}/g
  const pathVars = path.match(pathParseRegex)?.map((i) => i.slice(1, -1)) || []
  const pathVarArgs = pathVars.map((i) => `string ${i}`) || []
  const reqVars = []

  //request field arguments
  for (const reqField in reqFields) {
    reqVars.push(reqField)
    pathVarArgs.push(`${typeMap[reqFields[reqField]] || reqFields[reqField]} ${reqField}`)
  }

  const methodString = `${header}
    public void ${methodName}(${pathVarArgs.join(', ')}, Action<${
    res ? res : 'ResponseHelper'
  }> success, Action<RequestException> error)
    {
      var path = "${path}"; ${
    pathVars.length > 0
      ? `
      path = path.${pathVars.map((i) => `Replace("{${i}}",${i})`).join('.')};`
      : ''
  }
      var req = ${secure ? 'getAuthorizedRequest(path)' : 'getBasicRequest(path)'};
      ${
        req
          ? `req.Body = new ${req} { ${reqVars.map((i) => `${i} = ${i} `).join(', ')} };
      `
          : ''
      }RestClient.${method.verb[0].toUpperCase() + method.verb.slice(1)}${res ? `<${res}>` : ''}(req)
      .Then(res => { Debug.Log(res); success(res); })
      .Catch(err => HandleError(err, error));
    }
`
  return methodString
}
