import { describe, expect, test } from "vitest";
import { SortableNames } from "./sortable-names";

type NameFixture = {
  test: string;
  name: string;
  nameSorted: string;
};

/**
 * Provides fixtures in an overridable way.
 *
 * Arrays of objects passed into the function will look for
 * fixtures with matching values for `test` to override.
 *
 * @param overrides - Array of overrides for existing fixtures.
 * @returns Returns an array of fixtures to loop through in tests.
 */
const fixtures = (overrides?: NameFixture[]) => {
  // The default fixtures
  const authorTests = [
    { test: "mononym", name: "Homer", nameSorted: "Homer" },
    {
      test: "first and last names",
      name: "William Shakespeare",
      nameSorted: "Shakespeare, William",
    },
    {
      test: "first and last names with last name prefix",
      name: "Elizabeth von Arnim",
      nameSorted: "Arnim, Elizabeth von",
    },
    {
      test: "first, middle, and last names",
      name: "Mary Wollstonecraft Shelley",
      nameSorted: "Shelley, Mary Wollstonecraft",
    },
    {
      test: "first initial and last name",
      name: "T. Smollett",
      nameSorted: "Smollett, T.",
    },
    {
      test: "first and last names with special characters",
      name: "Rubén Darío",
      nameSorted: "Darío, Rubén",
    },
    {
      test: "name with honorific",
      name: "Sir Richard Francis Burton",
      nameSorted: "Burton, Richard Francis",
    },
    {
      test: "name with suffix",
      name: "Martin Luther King Jr.",
      nameSorted: "King, Martin Luther, Jr",
    },
    {
      test: "first name hyphenated",
      name: "Annie-B Parson",
      nameSorted: "Parson, Annie-B",
    },
    {
      test: "last name hyphenated",
      name: "Edward Bulwer-Lytton",
      nameSorted: "Bulwer-Lytton, Edward",
    },
    {
      test: "organization name",
      name: "U.S. Government Accountability Office",
      nameSorted: "U.S. Government Accountability Office",
    },
    {
      test: "organization name with article",
      name: "The Environmental Protection Agency",
      nameSorted: "Environmental Protection Agency, The",
    },
  ];

  if (overrides) {
    return authorTests.map(
      (authorTest) =>
        overrides.find((override) => override.test === authorTest.test) ??
        authorTest
    );
  }

  return authorTests;
};

describe("SortableNames with default configuration", () => {
  const sortable = new SortableNames();

  test.each(fixtures())("$test", ({ name, nameSorted }) => {
    expect(sortable.getSortable(name)).toBe(nameSorted);
  });
});

describe("SortableNames with configured orgWords", () => {
  const sortableOrgless = new SortableNames({ orgWords: [] });
  test.each(
    fixtures([
      {
        test: "organization name",
        name: "U.S. Government Accountability Office",
        nameSorted: "Office, U.S. Government Accountability",
      },
      {
        test: "organization name with article",
        name: "The Environmental Protection Agency",
        nameSorted: "Agency, The Environmental Protection",
      },
    ])
  )("no orgWords: $test", ({ name, nameSorted }) => {
    expect(sortableOrgless.getSortable(name)).toBe(nameSorted);
  });

  const sortableOrgsExtended = new SortableNames({
    orgWords: [...SortableNames.defaultOrgWords, "Test"],
  });
  test.each(
    fixtures([
      {
        test: "organization name",
        name: "Fake Test Org",
        nameSorted: "Fake Test Org",
      },
      {
        test: "organization name with article",
        name: "The Fake Test Org",
        nameSorted: "Fake Test Org, The",
      },
    ])
  )("extended or replaced orgWords: $test", ({ name, nameSorted }) => {
    expect(sortableOrgsExtended.getSortable(name)).toBe(nameSorted);
  });
});

describe("SortableNames with configured honorifics", () => {
  const sortableHonorless = new SortableNames({ honorifics: [] });
  test.each(
    fixtures([
      {
        test: "name with honorific",
        name: "Sir Richard Francis Burton",
        nameSorted: "Burton, Sir Richard Francis",
      },
    ])
  )("no honorifics: $test", ({ name, nameSorted }) => {
    expect(sortableHonorless.getSortable(name)).toBe(nameSorted);
  });

  const sortableHonorificExtended = new SortableNames({
    honorifics: [...SortableNames.defaultHonorifics, "Representative"],
  });
  test.each(
    fixtures([
      {
        test: "name with honorific",
        name: "Representative Shirley Chisholm",
        nameSorted: "Chisholm, Shirley",
      },
    ])
  )("extended or replaced honorifics: $test", ({ name, nameSorted }) => {
    expect(sortableHonorificExtended.getSortable(name)).toBe(nameSorted);
  });
});

describe("SortableNames with configured nameSuffixes", () => {
  const sortableSuffixless = new SortableNames({ nameSuffixes: [] });
  test.each(
    fixtures([
      {
        test: "name with suffix",
        name: "Martin Luther King Jr.",
        nameSorted: "Jr., Martin Luther King",
      },
    ])
  )("no honorifics: $test", ({ name, nameSorted }) => {
    expect(sortableSuffixless.getSortable(name)).toBe(nameSorted);
  });

  const sortableNameSuffixesExtended = new SortableNames({
    nameSuffixes: [
      ...SortableNames.defaultNameSuffixes,
      "KG",
      "KP",
      "GCB",
      "OM",
      "GCSI",
      "GCMG",
      "GCIE",
      "PC",
    ],
  });
  test.each(
    fixtures([
      {
        test: "name with suffix",
        name: "Horatio Herbert Kitchener, KG, KP, GCB, OM, GCSI, GCMG, GCIE, PC",
        nameSorted:
          "Kitchener, Horatio Herbert, KG, KP, GCB, OM, GCSI, GCMG, GCIE, PC",
      },
    ])
  )("extended or replaced nameSuffixes: $test", ({ name, nameSorted }) => {
    expect(sortableNameSuffixesExtended.getSortable(name)).toBe(nameSorted);
  });
});

describe("SortableNames with configured articles", () => {
  const sortableArticleless = new SortableNames({ articles: [] });
  test.each(
    fixtures([
      {
        test: "organization name with article",
        name: "The Environmental Protection Agency",
        nameSorted: "The Environmental Protection Agency",
      },
    ])
  )("no articles: $test", ({ name, nameSorted }) => {
    expect(sortableArticleless.getSortable(name)).toBe(nameSorted);
  });

  const sortableArticlesExtended = new SortableNames({
    articles: [...SortableNames.defaultArticles, "Ke"],
  });
  test.each(
    fixtures([
      {
        test: "organization name with article",
        name: "Ke Kukui Foundation",
        nameSorted: "Kukui Foundation, Ke",
      },
    ])
  )("extended or replaced articles: $test", ({ name, nameSorted }) => {
    expect(sortableArticlesExtended.getSortable(name)).toBe(nameSorted);
  });
});
