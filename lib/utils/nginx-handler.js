import { exec } from 'child_process';
import fs from 'fs';
import console from './Logger.js';

class NginxHandler {

    static loadConfig(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            throw new Error("Failed to read nginx configuration: " + err.message);
        }
    }

    static saveConfig(filePath, config) {
        try {
            fs.writeFileSync(filePath, config);
        } catch (err) {
            throw new Error("Failed to write nginx configuration: " + err.message);
        }
    }

    static async reload() {
        console.log("Attempting to reload Nginx...");


        // Test the new configuration
        exec('nginx -t', (error, stdout, stderr) => {
            if (error) {
                //console.error(`exec error: ${error}`);
                return;
            }

            // If test is successful, reload NGINX
            exec('nginx -s reload', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log('NGINX reloaded successfully!');
            });
        });

    }

}

export default NginxHandler;
