import { drawContentTable } from "../common/functions";

const removeSort = (selectors) => {
  [...selectors].forEach((element) => {
    if (element.classList.contains('up') || element.classList.contains('down')) {
      element.classList.remove('up');
      element.classList.remove('down');
    }
  });
};

export function sortableTool(aboutSort) {
const {
  target,
  table,
  trThs,
  pageId,
  year,
  month,
  monthlyData
} = aboutSort;


  const selectors = [...document.querySelectorAll('.sortable')].filter((f) => f !== target);
  removeSort(selectors);
  if (target.classList.contains('up')) {
    target.classList.remove('up');
    target.classList.add('down');
    drawContentTable({
      table,
      trThs,
      pageId,
      year,
      month,
      isDrawTable: true,
      employees: [],
      projects: [],
      monthlyData
    });
  } else {
    target.classList.remove('down');
    target.classList.add('up');
    drawContentTable({
      table,
      trThs,
      pageId,
      year,
      month,
      isDrawTable: true,
      employees: [],
      projects: [],
      monthlyData
    });
  }
}