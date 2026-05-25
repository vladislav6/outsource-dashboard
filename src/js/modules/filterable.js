import { createMyElement, createTooltip, removeTooltip, drawContentTable } from "../common/functions";

export function filterableTool(aboutFilter) {
  const {
    target,
    table,
    trThs,
    pageId,
    year,
    month,
    employees,
    projects,
    monthlyData
  } = aboutFilter;

  if (document.querySelector('.filter-tooltip')) {
    removeTooltip(null, 'filter-tooltip');
  }
  const input = createMyElement('input', 'filterable-input');
  input.type = 'text';
  input.placeholder = `Filter by ${target.getAttribute('data-filter')}`;

  createTooltip({
    targetElement: target,
    tooltipClass: 'filter-tooltip',
    tooltipStringContent: '',
    tooltipHtmlContent: input,
    position: 'start'
  });

  input.addEventListener('input', () => {
    if (input.value.length > 0) {
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
      drawContentTable({
        table,
        trThs,
        pageId,
        year,
        month,
        isDrawTable: true,
        employees,
        projects,
        monthlyData
      });
    }
  });
}