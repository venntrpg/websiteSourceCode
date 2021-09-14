# venntrpg website source code

Website: https://venntrpg.github.io/
Readable source code lives here!

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

#### just thinking about campaign DB format

campaigns:
campaign_id, name

campaign_combat:
combat_id, campaign_id, character_id, turn_number, attack_damage, accuracy, damage_type, status, special_data

(status: PENDING when initiated, COMPLETE after a full combat round OR accepted / blocked on user action)

campaign_logs:
campgain_id, character_id, log
