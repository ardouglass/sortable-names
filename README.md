# `sortable-names`

A JS class that formats name strings to semi-intelligently put the last name first, making them sortable by last name. Opinionated and English specific, but configurable.

## Why?

You might need something like this if you have a list of authors and want to make them sortable by last name. Moving the last part of the name isn't a full solution, because author names may have honorifics or suffixes that break a simple approach like that. A work could be authored by an organization as well, and rearranging the name wouldn't make sense.

### What sortable-names does by default

- Strips extra whitespace
- Removes honorifics before names
- Keeps suffixes like Jr, PhD, IV, etc. at the end of the name
- Leaves organization names mostly alone, only moving articles to the end of the name

### What you can configure

- The articles to move to the end of organization names
- The words that identify organizations
- The honorifics to strip from the beginning of names
- The suffixes to leave at the end of names

## Installing

Add the dependency:

`npm i sortable-names`

Import it and use it somewhere:

```js
import { SortableNames } from "sortable-names";

const sortableNames = new SortableNames();

const formattedName = sortableNames.getSortable(
  "Dr. Martin Luther King Jr., Ph.D."
);

console.log(formattedName);
// "King, Martin Luther, Jr, PhD"
```

## Sort helper

If you have an array of formatted names, sorting them isn't entirely trivial. Things like accented letters and puncuation in names like O'Malley can result in undesirable sorting order. Use the provided helper method to fix this.

```js
import { SortableNames } from "sortable-names";

const compare = SortableNames.compare;

const formattedNames = ["O'Malley, Virgil", "Oliver, John"];

// Compares the ' in O'Malley to the l in Oliver
console.log(formattedNames.toSorted());
// ["O'Malley, Virgil", "Oliver, John"]

// Ignores punctuation
console.log(formattedNames.toSorted(compare));
// ["Oliver, John", "O'Malley, Virgil"]
```

## Examples using defaults

These examples are sorted using the sort helper.

| Formatted                             | Original                              |
| ------------------------------------- | ------------------------------------- |
| Arnim, Elizabeth von                  | Elizabeth von Arnim                   |
| Bulwer-Lytton, Edward                 | Edward Bulwer-Lytton                  |
| Burton, Richard Francis               | Sir Richard Francis Burton            |
| Darío, Rubén                          | Rubén Darío                           |
| Environmental Protection Agency, The  | The Environmental Protection Agency   |
| Homer                                 | Homer                                 |
| King, Martin Luther, Jr               | Martin Luther King Jr.                |
| Ólafsdóttir, Auður Ava                | Auður Ava Ólafsdóttir                 |
| O'Mahony, Daniel                      | Daniel O'Mahony                       |
| Parson, Annie-B                       | Annie-B Parson                        |
| Shakespeare, William                  | William Shakespeare                   |
| Shelley, Mary Wollstonecraft          | Mary Wollstonecraft Shelley           |
| Smollett, T.                          | T. Smollett                           |
| U.S. Government Accountability Office | U.S. Government Accountability Office |

## Configuring options

If you are unhappy with the defaults or want to extend them, you can pass options into the constructor.

```js
import { SortableNames } from "sortable-names";

/**
 * To extend an option, the defaults are
 * available as static properties
 */
const extendedOrgWords = [...SortableNames.defaultOrgWords, "Circus(?:es)"];

/**
 * Only support org names in Spanish
 */
const replacedArticles = ["El", "Las?", "Los?", "Una?"];

/**
 * Don't strip any honorifics
 */
const noHonorifics = [];

/**
 * Suffixes can also be extended or modified,
 * for example to support LinkedIn Lunatics like
 * Horatio Herbert Kitchener, KG, KP, GCB, OM, GCSI, GCMG, GCIE, PC
 */
const extendedNameSuffixes = [
  ...SortableNames.defaultNameSuffixes,
  "KG",
  "KP",
  "GCB",
  "OM",
  "GCSI",
  "GCMG",
  "GCIE",
  "PC",
];

const configuredSortableNames = new SortableNames({
  articles: replacedArticles,
  orgWords: extendedOrgWords,
  honorifics: noHonorifics,
  nameSuffixes: extendedNameSuffixes,
});
```

Happy sorting!
