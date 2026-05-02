import { clearDOM, createMyElement, createPopup } from "../common/functions";
import { getContent } from "./content";

const getNumber = (n) => +Number(n).toFixed(2);

export function makeAssign(popupPosition, aboutPopup) {

  const assignPopupContent = createMyElement('div', 'assign-popup-content');

  const label = createMyElement('label', 'assign-label', 'Select Project:');
  const select = createMyElement('select', 'assign-select');
  select.name = 'projects';
  const assignBtn = createMyElement('button', 'btn assign-btn disable', 'Assign');
  assignBtn.disabled = true;
  const assignCnl = createMyElement('button', 'btn assign-cnl', 'Cancel');
  const btnBlock = createMyElement('div', 'assign-btn-block');

  assignCnl.addEventListener('click', () => document.body.removeChild(document.querySelector('.popup')));
  
  const defaultOption = createMyElement('option', '', 'Select a project');
  defaultOption.value = '';
  defaultOption.selected = true;
  select.append(defaultOption);

  const projectData = [];
  const currentCapacityProject = 0;
  for (let key in aboutPopup.projects) {
    projectData.push({
      id: aboutPopup.projects[key].id,
      capacity: aboutPopup.projects[key].capacity,
    });
    const option = createMyElement(
      'option',
      '',
      `${aboutPopup.projects[key].project}
      (${aboutPopup.projects[key].company})
      Available: ${aboutPopup.projects[key].capacity - currentCapacityProject}`);
    option.value = key;
    select.append(option);
  }

  const rangeBlock = createMyElement('div');
  select.addEventListener('change', (e) => {
    if (e.target.value) {
      clearDOM(rangeBlock);
      const capacityRange = createMyElement('input', 'range');
      capacityRange.type = 'range';
      capacityRange.min = 0;
      capacityRange.max = 1.5;
      capacityRange.step = 0.1;
      capacityRange.value =
        aboutPopup.currentCapacityEmployee !== 0 ?
        aboutPopup.maxCapacity - aboutPopup.currentCapacityEmployee : 1;
      const capacityRangeLabel = createMyElement('label', 'label', 'Capacity Allocation: ');
      const capacityRangeLabelValue = createMyElement('span', 'value', `${capacityRange.value}`);
      const capacityHint = createMyElement('span', 'hint', 'Adjust capacity (0.0 - 1.5)')

      capacityRangeLabel.append(capacityRangeLabelValue);
      capacityRangeLabel.append(capacityRange, capacityHint);
      
      const fitRange = createMyElement('input', 'range');
      fitRange.type = 'range';
      fitRange.min = 0;
      fitRange.max = 1;
      fitRange.step = 0.1;
      fitRange.value = 1;
      const fitRangeLabel = createMyElement('label', 'label', 'Project Fit: ');
      const fitRangeLabelValue = createMyElement('span', 'value', `${fitRange.value}`);
      const fitHint = createMyElement('span', 'hint', 'Project fit coefficient (0.0-1.0)');
      
      fitRangeLabel.append(fitRangeLabelValue);
      fitRangeLabel.append(fitRange, fitHint);

      const projectInfo = createMyElement('div', 'project-info');
      const projectCapacity = createMyElement('div', 'info-row', 'Project Capacity:');
      const capacityDefault = projectData[e.target.value].capacity;
      const projectCapacityValue = createMyElement(
        'span',
        'info-value',
        `${currentCapacityProject} / ${capacityDefault}`);
      projectCapacity.append(projectCapacityValue);
      
      const efectiveCapacity = getNumber(capacityRange.value * fitRange.value);

      const efectiveCapacityElement = createMyElement('div', 'info-row', 'Effective Capacity:');
      const efectiveCapacityValue = createMyElement('span', 'info-value', efectiveCapacity);
      efectiveCapacityElement.append(efectiveCapacityValue);

      const afterAssignment = createMyElement('div', 'info-row', 'After Assignment:');
      const wrapperElement = createMyElement('span', 'info-value');
      const afterAssignmentValue = createMyElement('span', '', `${efectiveCapacity + currentCapacityProject}`);
      const afterAssignmentCapacityValue = createMyElement('span', '', ` / ${capacityDefault}`);
      wrapperElement.append(afterAssignmentValue, afterAssignmentCapacityValue);
      afterAssignment.append(wrapperElement);
      
      projectInfo.append(projectCapacity, efectiveCapacityElement, afterAssignment);

      const validateRangeCapacity = createMyElement('p', 'validate-range-capacite');
      
      function validate(isValid, msg = '') {
        if (isValid) {
          assignBtn.disabled = false;
          assignBtn.classList.remove('disable');
          if (msg === '' && rangeBlock.contains(validateRangeCapacity)) {
            rangeBlock.removeChild(validateRangeCapacity)
          }
        } else {
          assignBtn.disabled = true;
          assignBtn.classList.add('disable');
          validateRangeCapacity.textContent = msg;
          if (msg !== '') {
            rangeBlock.append(validateRangeCapacity)
          }
        }
      }
      if (capacityDefault < efectiveCapacity + currentCapacityProject) {
        validate(
          false,
          `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${efectiveCapacity + currentCapacityProject})`
        );
      } else {
        validate(true);
      }
      
      rangeBlock.append(capacityRangeLabel, fitRangeLabel, projectInfo);
      if(validateRangeCapacity.textContent !== '') {
        rangeBlock.append(validateRangeCapacity);
      }
      
      capacityRange.addEventListener('input', (event) => {
        const targetValue = getNumber(event.target.value);
        capacityRangeLabelValue.textContent = targetValue;
        efectiveCapacityValue.textContent = getNumber(targetValue * getNumber(fitRangeLabelValue.textContent));
        const allCapacity = getNumber(getNumber(efectiveCapacityValue.textContent) + currentCapacityProject);
        afterAssignmentValue.textContent = allCapacity;

        if (targetValue === 0) {
          validate(
            false,
            'Please enter a valid capacity'
          );
        } else if (aboutPopup.currentCapacityEmployee + targetValue > aboutPopup.maxCapacity) {
          validate(
            false,
            `Employee capacity would exceed ${aboutPopup.maxCapacity} (current: ${aboutPopup.currentCapacityEmployee}, target: ${aboutPopup.currentCapacityEmployee + targetValue})`
          );          
        } else {
          if (capacityDefault < allCapacity) {
            validate(
              false,
              `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${allCapacity})`
            );
          } else {
            validate(true);
          }
        }
      });
      fitRange.addEventListener('input', (event) => {
        if (getNumber(capacityRangeLabelValue.textContent) !== 0) {
          const targetValue = getNumber(event.target.value);
          fitRangeLabelValue.textContent = targetValue;
          efectiveCapacityValue.textContent = getNumber(targetValue * getNumber(capacityRangeLabelValue.textContent));
          const allCapacity = getNumber(getNumber(efectiveCapacityValue.textContent) + currentCapacityProject);
          afterAssignmentValue.textContent = allCapacity;

          if (capacityDefault < allCapacity) {
            validate(
              false,
              `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${allCapacity})`
            );
          } else {
            validate(true);
          }
        }
      });

      assignBtn.addEventListener('click', () => {
        aboutPopup.monthlyData[`${aboutPopup.year}-${aboutPopup.month}`].employees[aboutPopup.key].assignments.push({
          projectId: projectData[e.target.value].id,
          capacity: capacityRangeLabelValue.textContent,
          fit: fitRangeLabelValue.textContent
        });
        localStorage.setItem('monthlyData', JSON.stringify(aboutPopup.monthlyData));
        if (document.querySelector('.popup')) {
          document.body.removeChild(document.querySelector('.popup'));
        }
        getContent(1);
      });

      if (window.innerHeight < parseInt(popup.style.top) + popup.offsetHeight) {
        popup.style.bottom = '20px';
        popup.style.top = 'auto';
      }
    } else {
      clearDOM(rangeBlock);
      assignBtn.disabled = true;
      assignBtn.classList.add('disable');
    }
  });

  label.append(select);
  btnBlock.append(assignBtn, assignCnl);
  assignPopupContent.append(label, rangeBlock, btnBlock);

  const popup = createPopup({
    title: `Assign ${aboutPopup.fullName}`,
    text: `Current Capacity: ${aboutPopup.currentCapacityEmployee} / ${aboutPopup.maxCapacity}`,
    subtext: `Available: ${aboutPopup.maxCapacity - aboutPopup.currentCapacityEmployee}`,
    content: assignPopupContent
  });

  document.body.append(popup);

  const popupHeight = popup.offsetHeight;
  const viewportHeight = window.innerHeight;
  if (popupPosition.bottom > viewportHeight - popupHeight) {
    popup.style.bottom = '20px';
  } else {
    popup.style.top = `${popupPosition.top + popupPosition.height + 10}px`;
  }
  
}