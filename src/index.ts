import { JobScheduler } from "./job-scheduler";

const myAsynFunction = async (param: string): Promise<any> => {
    await new Promise(resolve => {
        setTimeout(resolve, 500)
    })

    console.log("Done handling task:", param);
}

const init = async (queueName: string, functionToRun: Function, pollingTime: number) => {
    const jobScheduler = new JobScheduler(queueName, functionToRun, pollingTime);
    jobScheduler.run();
}

init('scheduler', myAsynFunction, 1000);
