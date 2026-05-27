import { closePopup, createLabel, createMyElement, createPopup,
  createRange, setPopupPosition, getNumber, onDisableButton, onActiveButton } from "../common/functions";
import { getContent } from "./content";

export function editAssign(popupPosition, aboutEdit) {
  let capacityRangeValue = Number(aboutEdit.capacity);
  let fitRangeValue = Number(aboutEdit.fit);
  
  const effectiveCapacity = Number(aboutEdit.effectiveCapacity);
  const projectCapacity = Number(aboutEdit.projectCapacity);

  const editAssign = createMyElement('div', 'popup-content');
  let editBtn = createMyElement('button', 'btn assign-btn', 'Edit');
  const editCnl = createMyElement('button', 'btn assign-cnl', 'Cancel');
  const btnBlock = createMyElement('div', 'assign-btn-block');
  const errorValidate = createMyElement('p', 'validate-range-capacity');

  editCnl.addEventListener('click', closePopup);

  const capacityRange = createRange({
    maxValue: 1.5,
    value: capacityRangeValue
  });
  
  const availableEmployeeCapacity = aboutEdit.employeeCapacity < 1.5
    ? Math.floor((1.5 - aboutEdit.employeeCapacity) * 10) / 10 
    : 0;
  
  let hintEmployeeCapacity = capacityRangeValue;
  if (getNumber(availableEmployeeCapacity + capacityRangeValue) <= 1.5) {
    hintEmployeeCapacity = getNumber(availableEmployeeCapacity + capacityRangeValue);
  }

  const capacityRangeLabel = createLabel({
    labelTitle: 'Capacity ',
    value: capacityRange.value,
    hintText: `Available range: (0.1 - 1.5)`,
    range: capacityRange,
    class: 'capacity-range-edit'
  });

  const fitRange = createRange({
    maxValue: 1.0,
    value: fitRangeValue
  });

  const fitRangeLabel = createLabel({
    labelTitle: 'Fit ',
    value: fitRange.value,
    hintText: `Available range: (0.1 - 1.0)`,
    range: fitRange,
    class: 'fit-range-edit'
  });

  let newEffectiveCapacity =  capacityRangeValue * fitRangeValue;
  const remainderCapacity = effectiveCapacity - newEffectiveCapacity;

  let isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) > 0;
  let isActiveEmployee = aboutEdit.employeeCapacity <= 1.5;
  editBtn = isActiveEmployee && isActiveProject ? onActiveButton(editBtn) : onDisableButton(editBtn);

  capacityRange.addEventListener('input', (e) => {
    const currentValue = Number(e.target.value);
    document.querySelector('.capacity-range-edit').textContent = currentValue;
    newEffectiveCapacity =  getNumber(currentValue * fitRange.value);
    isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) > 0;
    isActiveEmployee = currentValue <= hintEmployeeCapacity;
    editBtn = isActiveEmployee && isActiveProject ? onActiveButton(editBtn) : onDisableButton(editBtn);
    if (!isActiveProject) {
      editAssign.append(errorValidate);
      errorValidate.textContent = `Project capacity would be less than ${projectCapacity}`;
    }
    if (!isActiveEmployee) {
      editAssign.append(errorValidate);
      errorValidate.textContent = 'Employee capacity would be less than 1.5';
    }
    if (isActiveEmployee && isActiveProject && editAssign.contains(errorValidate)) {
      editAssign.removeChild(errorValidate)
    }
  });
  
  fitRange.addEventListener('input', (e) => {
    const currentValue = Number(e.target.value);
    document.querySelector('.fit-range-edit').textContent = currentValue;
    newEffectiveCapacity =  getNumber(currentValue * capacityRange.value);
    isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) >= 0;
    isActiveEmployee = capacityRange.value <= hintEmployeeCapacity;
    editBtn = isActiveProject && isActiveEmployee ? onActiveButton(editBtn) : onDisableButton(editBtn);
    if (!isActiveEmployee) {
      editAssign.append(errorValidate);
      errorValidate.textContent = 'Employee capacity would be less than 1.5';
    }
    if (!isActiveProject) {
      editAssign.append(errorValidate);
      errorValidate.textContent = `Project capacity would be less than ${projectCapacity}`;
    }
    if (isActiveEmployee && isActiveProject && editAssign.contains(errorValidate)) {
      editAssign.removeChild(errorValidate)
    }
  });

  editBtn.addEventListener('click', () => {
    const monthlyData = localStorage.getItem('monthlyData')
      ? JSON.parse(localStorage.getItem('monthlyData'))
      : {};
    monthlyData[`${aboutEdit.year}-${aboutEdit.month}`].employees.forEach((employee) => {
      if (employee.id === aboutEdit.employeeId) {
        for (let assign in employee.assignments) {
          if (employee.assignments[assign].projectId === aboutEdit.projectId) {
            employee.assignments[assign].capacity = capacityRange.value;
            employee.assignments[assign].fit = fitRange.value;
          }
        }
        localStorage.setItem('monthlyData', JSON.stringify(monthlyData));
        getContent(Number(document.querySelector('.active').getAttribute('data-id')));
        document.body.removeChild(document.querySelector('.popup'));
        document.body.removeChild(document.querySelector('.overlay'));
      }
    });
  });

  btnBlock.append(editBtn, editCnl);
  editAssign.append(capacityRangeLabel, fitRangeLabel, btnBlock);

  const text = aboutEdit.isProject ?
    `${aboutEdit.name} on ${aboutEdit.project}` :
    `${aboutEdit.project} on ${aboutEdit.name}`;
  
  const popup = createPopup({
    title: `Edit Assignment`,
    text,
    subtext: '',
    content: editAssign
  });
  
  document.body.append(popup);

  setPopupPosition(popup, popupPosition);
}