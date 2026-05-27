import { createMyElement, createTooltip, removeTooltip, drawContentTable, clearDOM, filterData } from "../common/functions";

export function filterableTool(aboutFilter, callback) {
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

  const filter = target.getAttribute('data-filter');
  const filterLabel = target.getAttribute('data-filter-label');
  const input = createMyElement('input', 'filterable-input');
  input.type = 'text';
  input.maxLength = 20;
  input.placeholder = `Filter by ${filterLabel}`;

  let projectFilter = projects;
  let employeeFilter = employees;

  createTooltip({
    targetElement: target,
    tooltipClass: 'filter-tooltip',
    tooltipStringContent: '',
    tooltipHtmlContent: input,
    position: 'start'
  });

  const filterChip = createMyElement('div', 'filter-chip');
  filterChip.setAttribute('data-filter', filter);
  let chipLabel = createMyElement('span', 'chip-label');
  const removeChip = createMyElement('button', 'remove-chip', 'x');
  const clearFilter = createMyElement('button', 'clear-filter', 'Clear Filters');
  filterChip.append(chipLabel, removeChip);

  const conteiner = document.querySelector('.filters-conteiner');
  let hasChip = false;
  if (conteiner.hasChildNodes()) {
    hasChip = [...document.querySelectorAll('.filter-chip')].some((chip) => chip.getAttribute('data-filter') === filter);
    if (hasChip) {
      const chip = [...document.querySelectorAll('.filter-chip')].filter((chip) => chip.getAttribute('data-filter') === filter);
      chipLabel = chip[0].querySelector('.chip-label');
    }
  }

  input.addEventListener('input', () => {
    if (input.value.length > 0 && input.value.length <= 20) {
      if (!conteiner.hasChildNodes() || !hasChip) {
        if (document.querySelector('.clear-filter')) {
          conteiner.insertBefore(filterChip, document.querySelector('.clear-filter'));
        } else {
          conteiner.append(filterChip);
        }
      } {
        if(document.querySelectorAll('.filter-chip').length > 1 && !document.querySelector('.clear-filter')) {
          conteiner.append(clearFilter);
        }
      }
      chipLabel.textContent = `${filterLabel}${input.value}`;

      if (pageId === 0) {
        projectFilter = filterData(projects, filter, input.value);
        callback(projectFilter);
      } else {
        employeeFilter = filterData(employees, filter, input.value);
        callback(employeeFilter);
      }
      drawContentTable({
        isDrawTable: true,
        employees: employeeFilter,
        projects: projectFilter,
        table,
        trThs,
        pageId,
        year,
        month,
        monthlyData
      });
    }
  });
}