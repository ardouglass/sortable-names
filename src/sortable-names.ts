/**
 * Type for the options object passed to the SortableNames constructor.
 */
type SortableNamesOptions = {
  /**
   * The articles to check for at the beginning of organizational names,
   * like "The" or "A." This can include regexes.
   */
  articles?: string[];
  /**
   * The list of words to check to determine if the name belongs to an
   * organization instead of a person. This can include regexes.
   */
  orgWords?: string[];
  /**
   * The list of words to check as name prefixes to remove from the final
   * strings. This can include regexes.
   */
  honorifics?: string[];
  /**
   * The list of words to check as name suffixes to leave at the end of the
   * final strings. This can include regexes.
   */
  nameSuffixes?: string[];
};

/**
 * NameSort allows for sorting full name strings alphabetically by last name.
 *
 * The following defaults can be configured in the constructor:
 * - Organizational names will attempt to remain as is
 *   ("Stark Industries" does not become "Industries, Stark")
 * - Name prefixes will be removed
 *   ("Dr. Stephen Strange" becomes "Strange, Stephen")
 * - Name suffixes will remain at the end
 *   ("Nicholas Fury Jr." becomes "Fury, Nicholas, Jr.")
 */
class SortableNames {
  /**
   * The default list of articles to check for at the beginning of org names and
   * move to the end.
   *
   * Regular expressions are valid. Each word is placed between a start position
   * character and a space to only check the first word of the string. Escaped
   * characters must be double escaped to be correct in the final regular expression.
   *
   * Can be overridden in the constructor object.
   */
  static defaultArticles = ["An?", "The", "Ye"];

  /**
   * The default list of words to check to determine if the name belongs to an
   * org instead of a person.
   *
   * Regular expressions are valid. Each word is placed between word boundaries
   * before running. Escaped characters must be double escaped to be correct in
   * the final regular expression.
   *
   * Can be overridden in the constructor object.
   */
  static defaultOrgWords = [
    "Academ(?:y|ies)",
    "Agenc(?:y|ies)",
    "Clubs?",
    "Co\\.?",
    "Collectives?",
    "Colleges?",
    "Committees?",
    "Compan(?:y|ies)",
    "Corporations?",
    "Councils?",
    "Entertainment",
    "Foundations?",
    "Games",
    "Governments?",
    "Groups?",
    "Inc\\.?",
    "Industr(?:y|ies)",
    "Institutes?",
    "Leagues?",
    "Librar(?:y|ies)",
    "Media",
    "National",
    "Networks?",
    "Offices?",
    "Schools?",
    "Societ(?:y|ies)",
    "Software",
    "Studios?",
    "Teams?",
    "Universit(?:y|ies)",
  ];

  /**
   * The default list of honorifics to remove from the returned names.
   *
   * Regular expressions are valid. Optional trailing periods are added
   * automatically, meaning "Mr" will also check for "Mr.". Each word is placed
   * between word boundaries before running. Escaped characters must be double
   * escaped to be correct in the final regular expression.
   *
   * Can be overridden in the constructor object.
   */
  static defaultHonorifics = [
    "M(?:[ia]ste)?r",
    "Mrs",
    "M(?:is)?s",
    "Mx",
    "D(?:octo)?r",
    "Prof(?:essor)?",
    "Rev(?:erend)?",
    "Sire?",
    "Dame",
    "Lord",
    "Lady",
  ];

  /**
   * The default list of name suffixes to keep at the end.
   *
   * Regular expressions are valid. Optional trailing periods are added
   * automatically, meaning "Jr" will also check for "Jr.". Each word is placed
   * between word boundaries before running. Escaped characters must be double
   * escaped to be correct in the final regular expression.
   *
   * Can be overridden in the constructor object.
   */
  static defaultNameSuffixes = [
    "J(?:unio)?r",
    "S(?:enio)?r",
    // Roman numerals up to 38, and pity for anyone that's the 39th+ in their line
    "(?=[XVI])(X{0,3})(I[XV]|V?I{0,3})",
    // Educational and professional suffixes
    "B\\.?Ed",
    "B\\.?F\\.?A",
    "B\\.?S",
    "B\\.?Sc",
    "B\\.?T",
    "B\\.?Tech",
    "C\\.?Eng",
    "C\\.?F\\.?A",
    "C\\.?I\\.?S\\.?A",
    "C\\.?I\\.?S\\.?S\\.?P",
    "C\\.?I\\.?S\\.?M",
    "C\\.?P\\.?A",
    "C\\.?P\\.?L",
    "C\\.?S\\.?A",
    "D\\.?B\\.?A",
    "D\\.?D\\.?S",
    "D\\.?M\\.?D",
    "D\\.?Min",
    "D\\.?Phil",
    "D\\.?V\\.?M",
    "Ed\\.?D",
    "Eng\\.?D",
    "Esq(?:uire)?",
    "J\\.?D",
    "M\\.?B\\.?A",
    "M\\.?D",
    "M\\.?Eng",
    "M\\.?F\\.?A",
    "M\\.?L",
    "M\\.?L\\.?A",
    "M\\.?S",
    "M\\.?Sc",
    "M\\.?S\\.?W",
    "P\\.?Eng",
    "Pharm\\.?D",
    "Ph\\.?D",
    "P\\.?M\\.?P",
    "R\\.?N",
    // Possibly surnames (which may be fully capitalized), so ignore forms without periods
    "A\\.B",
    "B\\.A",
    "B\\.E",
    "C\\.A",
    "D\\.O",
    "M\\.A",
    "M\\.E",
    "P\\.E",
  ];

  /**
   * The non-person words to check for that will prevent changing the order of words.
   */
  #articles: string[];
  /**
   * The non-person words to check for that will prevent changing the order of words.
   */
  #orgWords: string[];
  /**
   * The honorifics to check for that will be stripped from the name entirely.
   */
  #honorifics: string[];
  /**
   * The name suffixes to check for that will remain at the end of the name.
   */
  #nameSuffixes: string[];

  /**
   *
   * @param options - Options object to override the default settings.
   */
  constructor(options: SortableNamesOptions = {}) {
    this.#articles = options.articles || SortableNames.defaultArticles;
    this.#orgWords = options.orgWords || SortableNames.defaultOrgWords;
    this.#honorifics = options.honorifics || SortableNames.defaultHonorifics;
    this.#nameSuffixes =
      options.nameSuffixes || SortableNames.defaultNameSuffixes;
  }

  /**
   * Removes extra whitespace from the provided name.
   *
   * This includes leading, trailing, and duplicate interior spacing.
   *
   * @param name - The name to clear duplicate spaces from.
   * @returns Returns the name with extra spaces removed.
   */
  #removeWhitespace(name: string) {
    return name
      .split(" ")
      .filter((namePart) => namePart.length)
      .join(" ")
      .replaceAll(/ ?, ?/g, ", ");
  }

  /**
   * Removes prefixes from the name, like Mr., Dr., etc.
   *
   * @param name - The name to remove prefixes from.
   * @returns Returns the name without any prefixes.
   */
  #removeHonorifics(name: string) {
    // Combines all the prefixes into a single regex to avoid looping through them all
    const namePrefixTest = new RegExp(
      `^(${this.#honorifics.join("\\.?)\\s|\\b(")})\\b`,
      "g"
    );

    return name.replaceAll(namePrefixTest, "");
  }

  /**
   * Attempts to determine if the name belongs to an organization.
   *
   * @param name - The name to check for non-person words.
   * @returns Returns true if the name is probably an organization, and false otherwise.
   */
  #isOrganization(name: string) {
    // If there are no org words to check, assume false
    if (this.#orgWords.length <= 0) {
      return false;
    }
    // Combines all org words into a single regex to avoid looping through them all
    const organizationTest = new RegExp(
      `\\b(${this.#orgWords.join(")\\b|\\b(")})\\b`,
      "g"
    );

    return organizationTest.test(name);
  }

  /**
   * Attempts to determine if the name is already formatted correctly.
   *
   * @param name - The name to inspect and determine if it is already formatted with the last name first.
   * @returns Returns true if the name is probably already formatted with the last name first, and false otherwise.
   */
  #isPreformatted(name: string) {
    const endOfFirstWord = name.indexOf(" ");

    // Handle single word names
    if (endOfFirstWord === -1) {
      return false;
    }

    // If the first space is preceded by a comma, it's probably already sorted
    return name.charAt(endOfFirstWord - 1) === ",";
  }

  /**
   * Moves leading articles like A and The to the end of an organizational name.
   *
   * @param name - The name to move any articles to the end of.
   * @returns Returns the name with articles moved to the end.
   */
  #moveArticleToEnd(name: string) {
    const articleTest = new RegExp(`^(${this.#articles.join("|")}) (.+$)`, "i");
    return name.replace(articleTest, "$2, $1");
  }

  /**
   *
   * @param namePart - The name part to check for a suffix.
   * @returns Returns true if namePart matches the suffix list.
   */
  #isSuffix(namePart: string) {
    // Combines all org words into a single regex to avoid looping through them all
    const suffixTest = new RegExp(
      `^(${this.#nameSuffixes.join("\\.?)$|^(")})$`,
      "g"
    );

    return suffixTest.test(namePart);
  }

  /**
   * Moves the last name to the start of the string.
   *
   * Also checks to ensure that suffixes like Ph.D and Jr. remain at the end.
   *
   * @param name - The name to find the last name in and put at the start of the string.
   * @returns The name is Last, First, Suffixes format.
   */
  #moveLastNameToStart(name: string) {
    const strippedName = name.replaceAll(/,/g, "");
    const splitName = strippedName.split(" ");

    const lastNameIndex = splitName.findLastIndex(
      (namePart) => !this.#isSuffix(namePart)
    );

    const givenNames = splitName.slice(0, lastNameIndex);
    const lastName = splitName.at(lastNameIndex);
    const suffixes = splitName.slice(lastNameIndex + 1);

    const rearrangedName = `${lastName}${givenNames.length ? ", " : ""}${givenNames.join(" ")}${suffixes.length ? ", " : ""}${suffixes.join(", ").replaceAll(".", "")}`;

    return this.#removeWhitespace(rearrangedName);
  }

  /**
   * Converts the name to a form sortable by last name.
   *
   * @param name - The name to parse and return a sortable version of.
   * @returns The name formatted "Last, First Middle? LastPrefix?, Suffix?".
   */
  getSortable(name: string) {
    let sortableName = this.#removeWhitespace(name);

    // Return early if the sort order is correct
    if (this.#isPreformatted(sortableName)) {
      return sortableName;
    }

    // Handle organizational names
    if (this.#isOrganization(sortableName)) {
      return this.#moveArticleToEnd(sortableName);
    }

    // Remove honorifics
    sortableName = this.#removeHonorifics(sortableName);
    // Put the last name first
    sortableName = this.#moveLastNameToStart(sortableName);

    return sortableName;
  }

  /**
   * Helper comparator to pass to Array.sort() or Array.toSorted().
   *
   * This comparator will ignore things like accent marks, case, and punctuation.
   *
   * @param x - The first element for comparison.
   * @param y - The second element for comparison.
   * @returns A number indicating whether or not the first param is greater than the second param.
   */
  static compare = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
    ignorePunctuation: true,
  }).compare;
}

export { SortableNames };
