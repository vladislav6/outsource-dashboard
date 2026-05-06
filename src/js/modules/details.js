import { createModal, createMyElement } from "../common/functions";

export function getDetailsTable(details) {
  const table = createMyElement('table', 'table');
  const tr = createMyElement('tr');
  
  const th = createMyElement('th', '', `${details.thTitle}`);
  const thCapacity = createMyElement('th', '', 'Capacity');
  const thFit = createMyElement('th', '', 'Fit');
  const thVacation = createMyElement('th', '', 'Vacation');
  const thEffective = createMyElement('th', '', 'Effective');
  const thRevenue = createMyElement('th', '', 'Revenue');
  const thCost = createMyElement('th', '', 'Cost');
  const thProfit = createMyElement('th', '', 'Profit');
  const thActions = createMyElement('th', '', 'Actions');

  tr.append(th, thCapacity, thFit, thVacation, thEffective, thRevenue, thCost, thProfit, thActions);
  table.append(tr);
  
  const overlay = createModal({
    title: `${details.modalTitle} ${details.name}`,
    text: '',
    item: details.item,
    content: table
  });

  document.body.append(overlay);
}