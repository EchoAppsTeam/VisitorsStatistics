#!/usr/bin/env bash

read -p "parse.com Application name: " appName
read -p "parse.com AppId: " appId
read -p "parse.com Master Key: " masterKey
read -p "parse.com JavaScript Key: " jsKey
read -p "WebHook auth login: " authLogin
read -p "Webhook auth password: " authPass

cp `dirname $0`/config/global.sample.json `dirname $0`/config/global.json
sed -i "s/__APP_NAME__/$appName/g" `dirname $0`/config/global.json
sed -i "s/__APP_ID__/$appId/g" `dirname $0`/config/global.json
sed -i "s/__APP_MASTER_KEY__/$masterKey/g" `dirname $0`/config/global.json

cp `dirname $0`/cloud/config.sample.json `dirname $0`/cloud/config.js
sed -i "s/__APP_ID__/$appId/g" `dirname $0`/cloud/config.js
sed -i "s/__APP_JAVASCRIPT_KEY__/$jsKey/g" `dirname $0`/cloud/config.js
sed -i "s/__BASIC_AUHT_LOGIN__/$authLogin/g" `dirname $0`/cloud/config.js
sed -i "s/__BASIC_AUTH_PASSWORD__/$authPass/g" `dirname $0`/cloud/config.js
