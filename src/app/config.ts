import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {
    public clientId="2c3c3de8-aaaaa-bbbbbb-ccccc";          //here you can paste your client id
    public redirectUri="urn:ietf:wg:oauth:2.0:oob";
    public resourceUrl="https://example.sharepoint.com/";   //here you can paste your site url
    public AccessTokenURL = `https://login.microsoftonline.com/common/oauth2/token`;
}

