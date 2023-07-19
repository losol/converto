"use strict";

//adjusted from the default export
//see https://savaslabs.com/blog/using-strapi-v4-api-tokens-validate-custom-plugin-routes#the-right-way-according-to-me for more info
export default {
  "content-api": require("./content-api"),
};
/*
export default [
  {
    method: "POST",
    path: "/",
    handler: "htmlToPdfController.convert",
    config: {
      policies: [],
      auth: false,
    },
  },
];*/
