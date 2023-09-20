
/**
 * To sleep the current thread
 * @param {number} ms - sleem in milli-second
 * @returns {Promise<number} - promise of sleep
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const Utils = {
    sleep
};
  
export default Utils;