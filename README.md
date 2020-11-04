# Firebase getPrices Function

Javascript firebase function that queries Lyft and Uber's API to get the pricing between two locations

## Development 

### Dependencies 

Can install these by navigating to the [`/functions`](functions/) directory and running `yarn -i`, `yarn install`, or `yarn`

* Development 
  * [`eslint`](https://eslint.org/docs/user-guide/getting-started)
  * [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)
  * [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier)
  * [`eslint-plugin-promise`](https://github.com/xjamundx/eslint-plugin-promise)
  * [`firebase-functions-test`](https://github.com/firebase/firebase-functions-test)
  * [`prettier`](https://prettier.io/) 
* Production 
  * [`axios`](https://github.com/axios/axios) 
  * [`firebase-admin`](https://github.com/firebase/firebase-admin-node)
  * [`firebase-functions`](https://github.com/firebase/firebase-functions)

### Start 

Within the [`/functions`](functions/) directory, run: 

* `yarn serve` to begin an emulator UI suite on `localhost:4000`
  * As per the [`firebase.json`](firebase.json) file, all the functions will be hosted off of `localhost:5000`
