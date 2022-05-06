# MetaverStake

## Cloud Functions

```
curl "https://us-central1-metaverstake.cloudfunctions.net/projects?address={projectAddress}"

e.g. curl "https://us-central1-metaverstake.cloudfunctions.net/projects?address=0x854fb5E2E490f22c7e0b8eA0aD4cc8758EA34Bc9"
-> [{"totalStaked":0.0011,"apy":120}]

e.g. curl "https://us-central1-metaverstake.cloudfunctions.net/projects?address=0x854fb5E2E490f22c7e0b8eA0aD4cc8758EA34Bc9&address=0x92561F28Ec438Ee9831D00D1D59fbDC981b762b2"
-> [{"totalStaked":0.0011,"apy":120},{"totalStaked":0.1,"apy":120}]
```
