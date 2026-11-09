
# GAIC: Local Translator with QVAC

A small app that translates English to French on my own computer using the QVAC SDK and the BERGAMOT_EN_FR model. After the model is downloaded, it works without internet.

## Machine and versions

- Laptop: Lenovo [add model], Intel Core i5, 8 GB RAM, Intel UHD Graphics 620
- OS Name: Microsoft Windows 11 Pro
- OS Version: 10.0.26200 N/A Build 26200
- Node: v22.21.0
- npm: 10.9.4
- SDK: @qvac/sdk 0.22.0 (pinned in the package)
- Model: BERGAMOT_EN_FR (English to French)

## Setup

1. Install Node.js 22.21.x and check with `node --version`
2. Keep the internet on for the first run (it downloads the software and model)
3. Run `npm install`

## How to run

Default sentence:

```
npm run translate
```

Your own sentence:

```
npm run translate -- "The meeting starts at 6 pm."
```

## Feature

Translates one English sentence into French and prints the input, the output and how long the request took.

## Test results

| English input | French output | Time | Names / dates / numbers | Meaning |
|---|---|---|---|---|
| The meeting starts at 5 pm. | La rencontre commence à 17 heures. | 593 ms | 5 pm became 17 heures, correct | Kept. "Rencontre" is understandable, but "réunion" is the more usual word for a business meeting |
| Tayo and Amara will meet Dr. Okafor at the library. | Tayo et Amara rencontreront le Dr. Okafor à la bibliothèque. | 818 ms | Names unchanged | Kept |
| The workshop is on 9 November 2026. | L'atelier a lieu le 9 novembre 2026. | 443 ms | Day, month and year correct | Kept |
| My birthday is on 3/4/2026. (offline run) | Mon anniversaire est le 3/4/2026. | 818 ms | Date copied as is, not converted | Kept, but the date stays ambiguous |

## Offline test

I ran `npm run translate -- "My birthday is on 3/4/2026."` with the network disconnected, after the model had already been downloaded. It translated normally in 818 ms. This shows the translation runs on the device without internet.

## Quality check

Quality not yet checked by a fluent speaker. I did a first check myself on names, dates, numbers and meaning, but I cannot judge the French fully.

## Notes

- The model kept names (Tayo, Amara, Okafor) unchanged and handled the time (5 pm to 17 heures) and the written-out date correctly.
- The date "3/4/2026" is ambiguous. In English it can mean March 4 or 3 April, and in French it means 3 April. The model did not change it or write the month, so the meaning could be misread. Writing the month in words avoids this.
- Translation requests took between 443 ms and 818 ms.
- Before this project, my chat model crashed on the GPU (WORKER_CRASHED) and I had to run it on CPU. The translation project ran without that crash.

## Current blockers

- `npm install` reported 3 high severity vulnerabilities. I did not run `npm audit fix --force`, as the workshop says not to force upgrades first. Not yet investigated.
- Fluent-speaker check of the French is still to do.
- Tests with money, numbers and negation (for example "do not send before Friday") are still to do.

## Not tested

- Linux and Mac
- The optional document search