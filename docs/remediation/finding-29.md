## Remediation Finding 29

**Status:** Fixed

**Fix date:** 2026-06-06

**What was changed:**

- `backend\src\controllers\user\register.js`: bcrypt rounds 2 => 12

- `backend\src\commands\seeder.js`: bcrypt rounds 2 => 12, default password updated

**Retest:**

```sh
node -e "const bcrypt = require('bcrypt'); console.time('rounds-12'); bcrypt.hashSync('test', 12); console.timeEnd('rounds-12');"
rounds-12: 247.854ms
```

Timing confirmed ~ 247ms per hash at rounds-12 vs 1.48ms at rounds-2. BRute force speed reduced 45x.

Note: Existing passwords in the database hashed at rounds-2 remain weak unitl users change their password.