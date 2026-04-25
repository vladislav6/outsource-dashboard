import { projectTable } from "./projects";
import { employeeTable } from "./employees";
import { links } from "../common/lists";
import { clearDOM, createMyElement } from "../common/functions";

export function getContent(pageId) {
  const main = document.querySelector('.main');
  clearDOM(main);
  let table;
  let totalIncome;
  if (pageId === 0) {
    table = projectTable();
    totalIncome = createMyElement('p', 'total-income', 'Total Estimated Income: ');
    const total = createMyElement('span', 'total', '$0.00');
    totalIncome.append(total);
    main.append(totalIncome);
  }
  if (pageId === 1) {
    table = employeeTable();
  }

  main.prepend(table);
}

links.forEach((link) => link.default ? getContent(link.id) : '');