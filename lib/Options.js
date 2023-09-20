const os = require('os');

class Option {
    static ROUTING_TYPE = {
        ROUND_ROBIN: "",                //default empty
        LEAST_CONNECTION: "least_conn",
        IP_HASH: "ip_hash"
    };

    static INSTANCE = {
        AUTO: "auto",
        MAX: "max"
    };

    /**
     * @param {(number|string)} instance - A number of instance of app : between 1 and 100 or the string "auto".
     * @param {("round_robin"|"least_conn")} routingType - Type of routing to use.
     */
    constructor(instance, routingType) {
        if (typeof instance === 'number' && (instance >= 1 && instance <= 100)) {
            this.instanceCount = instance;
        } else if (instance === 'max' ) {
            this.instanceCount = os.cpus().length; // number of cpu-core
        }else if (instance === 'auto' ) {
            this.instanceCount = 1; // 1 for now if trafic increase it will increase.
        }else{
            throw new Error("Invalid instance type/count provided");
        }


        if (!Object.values(Option.ROUTING_TYPE).includes(routingType)) {
            throw new Error("Invalid routing type provided");
        }

        this.instance = instance;
        this.routingType = routingType;
    }
}

export default Option;
