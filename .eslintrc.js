module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-unused-vars": [
      "error",
      { "varsIgnorePattern": "ignored",
        "args": "none"
      }
    ],
    "object-curly-spacing": [
      "error", "always"
    ],
    "eqeqeq": "error",
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-console": 0
  }
}
