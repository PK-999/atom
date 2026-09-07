const message = [
  "This command is disabled: scripts/ingest-reference.ts is an unverified development example.",
  "It must not load credentials, contact a database, or publish evidence.",
  "Use the reviewed evidence pipeline (`npm run evidence:ingest`) only after R04 supplies its default transactional adapter and a real source has passed scientific, editorial, and licensing review.",
].join(" ");

console.error(message);
process.exitCode = 1;
