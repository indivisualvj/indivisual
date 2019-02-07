# Server options

``--https`` Use this options to start server with ssl

``--ssl-key path `` Use own private key for ssl

``--ssl-certificate path`` Use own certificate for ssl


## Examples

### Start server with own ssl

If you want to use indivisual over network, you can secure your connection with a command like this.

``$ yarn start --https --ssl-key path_to_my_key.key --ssl-cert path_to_my_cert.crt``