import Redis from "redis-mock";
import { promisify } from "util";

export class JobScheduler {
    private redisClient = Redis.createClient();
    private _lastTaskPopTime: number | null;

    private zadd: (key: string, score: number, item: string) => Promise<any>
        = promisify(this.redisClient.zadd).bind(this.redisClient);

    private zrangebyscore: (key: string, min: number, max: number, withscores?: string) => Promise<any>
        = promisify(this.redisClient.zrangebyscore).bind(this.redisClient);

    private zrem: (key: string, item: string) => Promise<any>
        = promisify(this.redisClient.zrem).bind(this.redisClient);

    private async timeout (ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    constructor(public queueName: string, public functionToInvoke: Function, public pollingTime: number) {
        this.queueName = queueName;
        this.functionToInvoke = functionToInvoke;
        this.pollingTime = pollingTime;
        this._lastTaskPopTime = null;
    }

    public async run() {
        try {
            let tasks: string[];
            const now = Date.now().valueOf();
            
            tasks = await this.zrangebyscore(this.queueName, this._lastTaskPopTime || -Infinity, now);
            
            if (tasks[0]) {
                this.functionToInvoke(tasks[0]).then(async () => {
                    return await this.zrem(this.queueName, tasks[0]);
                });               
                
                this._lastTaskPopTime = JSON.parse(tasks[0]).score + 1;   
            }
1
            await this.timeout(this.pollingTime);

            this.run();
        } catch (err) {
            throw err;
        }
    }

    public async addTask (task: string, time: Date) {
        try {
            const score = time.valueOf(); 
            
            const taskData = {
                task,
                score
            }

            await this.zadd(this.queueName, score, JSON.stringify(taskData));
        } catch(err) {
            throw err;
        }
    }
}
