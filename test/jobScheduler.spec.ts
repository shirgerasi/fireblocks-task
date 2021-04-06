import { expect } from 'chai';
import 'mocha';
import * as sinon from 'sinon';

import { JobScheduler } from "../src/job-scheduler";

const asyncFunctionTimeout = 1500;

const timeout = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const asyncFunction = async (param: string): Promise<any> => {
    await timeout(asyncFunctionTimeout);

    return (JSON.parse(param)).task;
};

describe('Job scheduler behavior', () => {
    let spyMyFunction;
    let jobScheduler;
    
    const task1 = 'one';
    const task2 = 'two';

    beforeEach(() => {
        spyMyFunction = sinon.spy(asyncFunction);
        jobScheduler = new JobScheduler('scheduler', spyMyFunction, 1000);
        jobScheduler.run();
    });

    afterEach(() => {
        spyMyFunction.resetHistory();
    });

    it('should invoke the callback function with the task after the time to run it arrives', async () => {
        const time1 =  new Date();
        const time2 =  new Date(Date.now() + 1000);

        await jobScheduler.addTask(task1, time1);
        await jobScheduler.addTask(task2, time2);

        await timeout(asyncFunctionTimeout * 2);

        expect(await spyMyFunction.getCall(0).returnValue).to.equal(task1);
        expect(await spyMyFunction.getCall(1).returnValue).to.equal(task2);
    });

    it('should not invoke the callback function if the time to run it has not arrived', async () => {
        const time =  new Date(Date.now() + 6000);

        await jobScheduler.addTask(task1, time);
        
        await timeout(asyncFunctionTimeout * 3);

        expect(spyMyFunction.notCalled).to.equal(true);
    });

    it('should invoke the callback without blocking the processing of the next jobs in the queue', async () => {
        const time1 =  new Date();
        const time2 =  new Date(Date.now() + 1);

        await jobScheduler.addTask(task1, time1);
        await jobScheduler.addTask(task2, time2);

        await timeout(asyncFunctionTimeout);

        expect(await spyMyFunction.getCall(0).returnValue).to.equal(task1);
        expect(await spyMyFunction.getCall(1).returnValue).to.equal(task2);
    });
});