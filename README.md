ts-node Project setup.
===
## Created By Kwabena Ankobia


### This repository is to created make your life easier when creating a typescript project. ts-node is used so that you can you can compile and run individual typescript files.

Prerequisites
---

You will need to install typescript and ts-node to run this project. You will then need to install the required packages. Follow the commands below to setup your environment.

```
$ npm install --location=global typescript
$ npm install --location=global ts-node
$ npm install
```

<p>To run the script, run the command below.<p>

```
$ npm run start
```

---

Running files: 
- Use `ts-node` to run individual files.
- For example 
```
$ ts-node app/src/index.ts
```


Running individual tests: 
```
$ npm test -- Browser.spec.ts --verbose
```


Running all test tests: 
```
$ npm test
```
---
More scripts have been defined in the package.json