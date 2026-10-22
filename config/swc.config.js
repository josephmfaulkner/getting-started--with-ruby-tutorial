// Merged into Shakapacker's default SWC loader options (see node_modules/shakapacker/package/rules/swc.js)
const { env } = require("shakapacker")

module.exports = {
  options: {
    jsc: {
      transform: {
        react: {
          // Use React 17+'s automatic JSX runtime so components don't need `import React`
          runtime: "automatic",
          development: env.isDevelopment
        }
      }
    }
  }
}
