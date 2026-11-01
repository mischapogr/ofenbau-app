# secrets/

`ofenbau.enc.env` holds the repository owner's credentials, encrypted with
[sops](https://github.com/getsops/sops) and [age](https://age-encryption.org).
Only the age recipient listed in `.sops.yaml` can decrypt it.

**Contributors do not need this directory.** Copy `.mcp.env.example` to
`.mcp.env` for your own tokens instead. See [`docs/SECRETS.md`](../docs/SECRETS.md)
for the full model, the owner workflow and rotation.

Never commit a decrypted copy — `*.dec.*` is git-ignored and the pre-commit hook
refuses it.
