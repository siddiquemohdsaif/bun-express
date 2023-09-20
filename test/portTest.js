import PortHandler from '../lib/utils/port-handler.js';

// Example usage:
(async () => {
  console.log(await PortHandler.isPortInUse(8080));
  console.log(await PortHandler.getAvailablePort(5, 4100));
})();
