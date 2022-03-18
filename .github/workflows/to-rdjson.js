/**
 * This program receives Spectral JSON output and returns ReviewDog JSON format.
 *
 * Usage:
 *
 * ```
 * npx spectral lint -f json your-spec.yaml | node ./to-rdjson.js | reviewdog -f=rdjson
 * ```
 */
const { readFileSync } = require("fs");
const { inspect } = require("util");
const stdin = readFileSync(0).toString("utf8");
const errors = JSON.parse(stdin);
process.stderr.write(
  inspect(errors, { depth: null, compact: true, colors: true }) + "\n"
);
const source = {
  name: "spectral",
  url: "https://meta.stoplight.io/",
};
const pos = ({ line, character }) => ({
  line: line + 1,
  column: character + 1,
});
const diagnostics = errors.map(({ message, source, range, code }) => ({
  message,
  location: {
    path: source,
    range: {
      start: pos(range.start),
      end: pos(range.end),
    },
  },
  code: {
    value: code,
  },
}));
process.stdout.write(JSON.stringify({ source, diagnostics }, null, 2));
process.exit(errors.length > 0 ? 1 : 0);
