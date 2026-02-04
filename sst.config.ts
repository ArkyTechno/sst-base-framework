/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "arkytechno-launchpad",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      tags: {
        app: "arkytechno-launchpad",
        stage: input.stage,
        managedBy: "sst",
        team: "backend",
      },
    };
  },
  async run() {
    const mongoUrl = new sst.Secret("MONGODB_URI");

    const api = new sst.aws.ApiGatewayV1("arkytechno-launchpad-api");

    // Import and register Handler routes
    const { initializeLambdas } = await import("@infra/lambda.handlers");
    initializeLambdas(api, [mongoUrl]);

    api.deploy();

    api.url.apply((url) => {
      console.log("\n🚀 API Endpoint:");
      console.log(url);
    });
  },
});
