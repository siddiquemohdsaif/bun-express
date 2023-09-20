class Logger {
    constructor(env = 'production') {
      this.env = env;
    }
  
    log(...args) {
      if (this.env === 'developmentss') {
        console.log(...args);
      }
    }
  
    static createLogger(env) {
      return new Logger(env);
    }
  }
  
  // Setting the env at the start of the app
  const logger = Logger.createLogger(process.env.NODE_ENV || 'production');
  
  export default logger;