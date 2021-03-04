const pg = require("pg");
const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const { default: PgPubsub } = require("@graphile/pg-pubsub");
require("dotenv").config();
const app = express();
const pluginHook = makePluginHook([PgPubsub]);
console.log(process.env.POSTGRES_DB);
console.log(process.env.POSTGRES_USER);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
app.use(
  postgraphile(pgPool, ["app_public"], {
    pluginHook,
    subscriptions: true,
    simpleSubscriptions: true,
    graphiql: true,
    enhanceGraphiql: true,
    enableCors: true,
    allowExplain(req) {
      return true;
    },
  })
);
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`🚀 Server ready at http://[host]:${port}/graphql`);
console.log(`🚀 Graphiql UI ready at http://[host]:${port}/graphiql`);
