import net from 'net';

/**
 * Check if a port is in use.
 * @param {number} port - The port number to check.
 * @returns {Promise<boolean>} - True if the port is in use, false otherwise.
 */
const isPortInUse = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          reject(err);
        }
      })
      .once('listening', () => {
        server.once('close', () => {
          resolve(false);
        })
        .close();
      })
      .listen(port);
    });
}

/**
 * Get a list of available ports.
 * @param {number} count - Number of available ports needed.
 * @param {number} minPort - The starting port number to check.
 * @returns {Promise<number[] | null>} - List of available ports or null if not enough ports are available.
 */
const getAvailablePort = async (count, minPort) => {
  let availablePorts = [];
  let currentPort = minPort;

  while (availablePorts.length < count) {
    if (await isPortInUse(currentPort)) {
      currentPort++;
    } else {
      availablePorts.push(currentPort);
      currentPort++;
    }

    // If we've checked a large range and still can't find the desired number of ports, return null.
    // For instance, if we've checked 10000 ports and still can't find the desired number, we assume it's not possible.
    if (currentPort - minPort > 10000) {
      return null;
    }
  }

  return availablePorts;
}

const PortHandler = {
    isPortInUse,
    getAvailablePort
};
  
export default PortHandler;
