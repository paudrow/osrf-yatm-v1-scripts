# README

Here is a collection of OSRF scripts used to make requirements for
[yatm-v1](https://github.com/audrow/yatm).

If you are using [yatm-v2](https://github.com/paudrow/yatm-v2), you can use the
[migration script](https://github.com/paudrow/yatm-v2/tree/main/src/migrate_v1_requirements)
to convert these to work with v2.

## Setup

Install [Deno](https://deno.com/):

```bash
curl -fsSL https://deno.land/install.sh | sh
```

Clone the repository.

Then run `deno task` to see the available tasks. The output should look
something like this:

```
Available tasks:
- test
    deno test -A
- ros2-docs
    deno run --allow-net --allow-write --allow-env src/ros2-docs/main.ts
```

You can run `deno task <task>` to run a task.
