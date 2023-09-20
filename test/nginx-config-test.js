import fs from 'fs';
import BunNginxConfigEditor from '../lib/load-balancer/nginx-config-editor';

let nginxConfig = fs.readFileSync('nginx_config.txt', 'utf8');  // Read the config file

nginxConfig = BunNginxConfigEditor.addStreamBlock(nginxConfig, 1000, [8050,8051,8052,8899,7777], 'least_conn');  // Add a stream block
//nginxConfig = BunNginxConfigEditor.removeStreamBlock(2000, nginxConfig);  // Remove a stream block

//nginxConfig = BunNginxConfigEditor.formatStreamBlock( nginxConfig);  // Remove a stream block

fs.writeFileSync('nginx_config.txt', nginxConfig);  // Save the modified config
