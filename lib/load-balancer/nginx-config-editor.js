class BunNginxConfigEditor {

    static addStreamBlock(nginxConfigFile, port, instancesPort, routingMethod) {
        const upstreamName = `bun_${port}__instanses_server`;

        let routingMethodLine = routingMethod + ";";
        if(routingMethod == ""){
            routingMethodLine =  "";
        }
    
        // Create upstream block using concatenated strings
        const upstreamBlock = "    upstream " + upstreamName + " {\n" +
                              "        " + routingMethodLine +
                              instancesPort.map(p => "\n        server 127.0.0.1:" + p + ";").join('')+ 
                              "\n    }";
    
        // Create server block using concatenated strings
        const serverBlock = "    server {\n" +
                            "        listen " + port + ";\n" +
                            "        proxy_pass " + upstreamName + ";\n" +
                            "    }";
    
        // Remove existing blocks if they exist
        nginxConfigFile = this.removeStreamBlock(port, nginxConfigFile);
    
        // Check if stream block exists
        if (nginxConfigFile.includes("stream {")) {
            // Insert new blocks inside the existing stream block
            nginxConfigFile = nginxConfigFile.replace("stream {", "stream {\n" + upstreamBlock + "\n" + serverBlock);
        } else {
            // Add a stream block with the new blocks
            nginxConfigFile += "stream {\n" + upstreamBlock + "\n" + serverBlock + "\n}";
        }
    
        return this.formatStreamBlock(nginxConfigFile);
    }
    

    static removeStreamBlock(port, nginxConfigFile) {
        const upstreamName = `bun_${port}__instanses_server`;

        // Regular expressions for finding and removing blocks
        const upstreamRegex = new RegExp(`upstream ${upstreamName} \\{[^\\}]+\\}`, 'g');
        const serverRegex = new RegExp(`server \\{[^\\}]*listen ${port};[^\\}]+\\}`, 'g');

        nginxConfigFile = nginxConfigFile.replace(upstreamRegex, '');
        nginxConfigFile = nginxConfigFile.replace(serverRegex, '');

        // If the stream block is empty, remove it
        nginxConfigFile = nginxConfigFile.replace(/stream \{\s*\}/, '');

        return this.formatStreamBlock(nginxConfigFile);
    }

    static formatStreamBlock(nginxConfigFile) {
        // Extract the stream block using a more sophisticated regex
        let depth = 0;
        const streamBlockMatch = nginxConfigFile.match(/stream\s*\{[^]*?\n\}/g);
        if (!streamBlockMatch) {
            return nginxConfigFile;  // Return the original if no stream block found
        }

        let streamBlock = streamBlockMatch[0];

        // Remove lines that only contain spaces or are empty
        streamBlock = streamBlock.split('\n').filter(line => line.trim() !== '').join('\n');

        // Replace the old stream block with the formatted one
        return nginxConfigFile.replace(/stream\s*\{[^]*?\n\}/g, streamBlock);
    }

}

export default BunNginxConfigEditor;
