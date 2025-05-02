# Akamai Edgeworker Mocks

The files in this folder are a copy of the [Jest mocks provided by Akamai](https://github.com/akamai/edgeworkers-unittest/tree/main/jest/__mocks__).

However, they have then been edited to be vitest mocks instead of Jest mocks, as we're not using Jest.

TODO: Could we use Akamai's unedited files, and simply rewrite the jest package to use vitest? If we can do that then we might be able to refer to them from the node module directly.