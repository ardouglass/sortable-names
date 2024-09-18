import { SortableNames } from "../src/sortable-names";
import { BaseElement } from "./BaseElement.ts";

const sortableNames = new SortableNames();

const { compare } = SortableNames;

class NameTable extends BaseElement {
  #rawNames = [
    "Daniel O'Mahony",
    "Auður Ava Ólafsdóttir",
    "Homer",
    "William Shakespeare",
    "Elizabeth von Arnim",
    "Mary Wollstonecraft Shelley",
    "T. Smollett",
    "Rubén Darío",
    "Sir Richard Francis Burton",
    "Martin Luther King Jr.",
    "Annie-B Parson",
    "Edward Bulwer-Lytton",
    "U.S. Government Accountability Office",
    "The Environmental Protection Agency",
  ];

  names: { name: string; nameFormatted: string }[];

  static styles = `
    table {
      width: 100%;
      border-spacing: 0;
    }

    td,
    th {
      padding: 0.4rem;
    }

    td:first-child,
    th:first-child {
      padding-left: 0;
    }

    td:last-child,
    th:last-child {
      padding-right: 0;
    }

    th {
      border-bottom: 0.1rem solid var(--fg);
      text-align: left;
    }

    td {
      border-bottom: 0.05rem solid var(--fg);
    }
  `;

  constructor() {
    super();

    this.names = this.#rawNames.map((name) => ({
      name,
      nameFormatted: sortableNames.getSortable(name),
    }));

    this.names = this.names.toSorted((a, b) =>
      compare(a.nameFormatted, b.nameFormatted)
    );
  }

  render() {
    return `
      <table>
        <thead>
          <tr>
            <th>Formatted</th>
            <th>Original</th>
          </tr>
        </thead>
        <tbody>
          ${this.names.map((name) => `<tr><td>${name.nameFormatted}</td><td>${name.name}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
  }
}
customElements.define("name-table", NameTable);
