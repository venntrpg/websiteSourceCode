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

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Todo:

### Character sheet:

- [x] (Medium, Easy) Make component for displaying item's descriptions. If its a grenade, show its special instead
- [x] (High) Update item shop so that it opens a side panel when you click the button. Allows you to buy multiple copies of the item
- [ ] (High) Add "Combat" page which includes actions you can take immediately. Include unarmed, improvised, any grenades in inventory, and any equipped weapons. Also, consumable items & abilities which are actively usable. Also basic actions (move, assist, delay, attack)
- [x] (Medium) Add armor to item shop & add any custom fields to item objects if any are needed. Support burden automatically. [https://vennt.fandom.com/wiki/Armor](https://vennt.fandom.com/wiki/Armor)
- [x] (Medium) Change scrolling behavior when you open a side panel so that the table scrolls so the item you just openned is still in view, and in reverse when you close the side panel
- [ ] (Low) Change my custom subrouting behavior to use Vue's behavior. Should hopefully improve the page's code a bit [https://router.vuejs.org/guide/essentials/named-views.html#nested-named-views](https://router.vuejs.org/guide/essentials/named-views.html#nested-named-views)
- [x] (Medium) Show list of owned ammo / ammunition on weapons with the "ranged" weaponType (except grenades or "consumable").
- [x] (Medium) When an abilitiy is usable, when you use it it should automatically subtract any resources it used (mp, vim, etc)
- [ ] (Medium) Improve custom item insertion. Keep a quick insertion ability & allow more complex items.
- [ ] (Medium) Implement custom ability creation.
- [ ] (Low) Allow users to add flavor information about character. (backstory etc)
- [ ] (Low) Add a way to store character's flux information
- [ ] (Low) Add greivous injury support.
- [ ] (Low) Support weaponsmithing.
- [ ] (Low) Hide parts of the character sheet depending on what paths have been unlocked
- [ ] (Low) Add some way to show which abilities have been unlocked. Also add some sort of visualization of the abilities you have taken (e.g. a tree or something would be very cool)

### General:

- [x] move toolTip css to main / generally try to consolidate css
- [x] split vuex into seperate modules
- [x] keep splitting components if possible
- [x] update double confirm button with a confirmation modal floating in the middle of the screen
- [x] convert divs to labels for inputs
- [x] use mustaches when possible {{ }} to replace v-text & v-html
- [x] make color references more generic so we can add a dark mode
- [ ] make mobile nav button reveal a dropdown
- [x] replace SVGs with font
