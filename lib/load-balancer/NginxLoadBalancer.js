import { fork } from 'child_process';
import PortHandler from "../utils/port-handler";
import Option from "../Options";
import BunNginxConfigEditor from "./nginx-config-editor";
import NginxHandler from "../utils/nginx-handler";
import Utils from "../utils/Utils";
import console from '../utils/Logger.js';

class NginxLoadBalancer {

    /**
     * constructor
     * @param {number} port - port where the traffic hit.
     * @param {Option} option - Configuration options for the load balancing.
     */
    constructor(port, option) {
        this.port = port;
        this.option = option;
    }

    async start() {

        if (this.option.instanceCount === 1) {
            await NginxLoadBalancer.CLEAR_PORT(this.port);
            return this.port; // only one instance, no need for load balancing
        }

        const instancesPort = await PortHandler.getAvailablePort(this.option.instanceCount, 11000);

        if (!instancesPort) {
            throw new Error("Not enough available ports to run instances");
        }

        // 1) Load nginx-config file
        const nginxConfigPath = '/etc/nginx/nginx.conf';
        let nginxConfig = NginxHandler.loadConfig(nginxConfigPath);

        console.log("load config");

        // 2) Modify nginx-config
        nginxConfig = BunNginxConfigEditor.addStreamBlock(nginxConfig, this.port, instancesPort, this.option.routingType.toString());

        // 3) Save nginx-config file
        NginxHandler.saveConfig(nginxConfigPath, nginxConfig);

        console.log("saved config");

        // 4) Reload Nginx to apply the new configuration
        try {
            await NginxHandler.reload();
        } catch (err) {
            console.log(err);
            throw new Error(err.message);
        }

        console.log("reload nginx");

        // 5) Start (instancesPort.length-1) child instances with env set 
        // ( process.env.CLUSTER_BUN_WORKER = true , process.env.CLUSTER_BUN_WORKER_PROXY_PORT = instancesPort[i] 
        for (let i = 1; i < instancesPort.length; i++) {
            fork(process.argv[1], [], {
                env: {
                    ...process.env,
                    CLUSTER_BUN_WORKER: true,
                    CLUSTER_BUN_WORKER_PROXY_PORT: instancesPort[i]
                }
            });
        }

        console.log("fork childs ");

        return instancesPort[0];  // return first port for master
    }

    static async CLEAR_PORT(port) {
        // 1) Load nginx-config file
        const nginxConfigPath = '/etc/nginx/nginx.conf';
        let nginxConfig = NginxHandler.loadConfig(nginxConfigPath);

        console.log("load config");

        // 2) Modify nginx-config
        const nginxConfigNew = BunNginxConfigEditor.removeStreamBlock(port, nginxConfig);

        if(nginxConfigNew === nginxConfig){
            console.log("no change");
            return
        }

        // 3) Save nginx-config file
        NginxHandler.saveConfig(nginxConfigPath, nginxConfigNew);

        console.log("saved config");

        // 4) Reload Nginx to apply the new configuration
        try {
            await NginxHandler.reload();
        } catch (err) {
            console.log(err);
            throw new Error(err.message);
        }

        //console.log("reload nginx");
        await Utils.sleep(500);

    }
}

export default NginxLoadBalancer;
