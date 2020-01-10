# hover-api-esm

JS ESM API Client for the un-official Hover DNS Api. 

Inspiration drawn from: 
- [https://gist.github.com/dankrause/5585907](https://gist.github.com/dankrause/5585907)
- [hover-api](https://github.com/swhite24/hover-api)

## Disclaimer

This is using native [ESM modules](https://nodejs.org/api/esm.html) without any transpiler or tool. This requires `node 12.x` with the flag set via `--experimental-modules` or `node 13.x` +

## Example Usage

```js
    const main = async () => {
        await hover.login('username','password')
        console.log(await hover.getDomains())
        console.log(await hover.getRecords('domain'))
    }
    main()
```