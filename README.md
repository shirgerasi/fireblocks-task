# fireblock-task

Welcome!

In this exercise you will build a timed job scheduler using Redis.

You're given an empty ts-node project.
To run it, use:
npm install
npm run start

In job-scheduler.ts you're given:
1. A mock Redis client.
2. Three promisified Redis commands. You may use other redis commands if you like.
(This is just to save you some hassle. If you have something else in mind, you can delete them).

Your task is to create a job scheduler that will:
1. Be initialized with a callback function.
2. Get tasks to schedule (as an object or a type of your choosing), and the time to start each task.
3. Invoke the callback function with the task after the time to run it arrives.
4. Invoking the callback should not block the processing of the next jobs in the queue.

Important notes:
1. A task is simply some arguments that the callback knows how to handle. We don't mean to serialize code into Redis.
2. While our service (the code that is using the scheduler) is running, it can always schedule more tasks.

You may refer to the page on delayed tasks in the Redis documentation:
https://redislabs.com/ebook/part-2-core-concepts/chapter-6-application-components-in-redis/6-4-task-queues/6-4-2-delayed-tasks/

BONUS:
Sometimes running a task may take some time.
If the service is restarted for some reason while tasks are running, we want to be able to re-run all tasks that did not finish processing.

You may install additional npm packages as you like (except for ones that implement task queues over redis).

Good luck!
