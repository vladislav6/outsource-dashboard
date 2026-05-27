import { clearDOM, createMyElement, createPopup, getNumber,
  getEmployeeAssignmentsCountCapacity, setPopupPosition, 
  createRange, createLabel, closePopup
} from "../common/functions";
import { getContent } from "./content";

export function makeAssign(popupPosition, aboutPopup) {

  const assignPopupContent = createMyElement('div', 'popup-content');

  const label = createMyElement('label', 'assign-label', 'Select Project:');
  const select = createMyElement('select', 'assign-select');
  select.name = 'projects';
  const assignBtn = createMyElement('button', 'btn assign-btn disable', 'Assign');
  assignBtn.disabled = true;
  const assignCnl = createMyElement('button', 'btn assign-cnl', 'Cancel');
  const btnBlock = createMyElement('div', 'assign-btn-block');

  assignCnl.addEventListener('click', closePopup);
  
  const defaultOption = createMyElement('option', '', 'Select a project');
  defaultOption.value = '';
  defaultOption.selected = true;
  select.append(defaultOption);

  const validateRangeCapacity = createMyElement('p', 'validate-range-capacity');

  let capacityValue = 0;
  let fitValue = 0;
  let selectedProject = '';
  const projectData = [];
  for (let key in aboutPopup.projects) {

    const currentCapacityProject = getEmployeeAssignmentsCountCapacity(aboutPopup.employees)[aboutPopup.projects[key].id] ?
      getEmployeeAssignmentsCountCapacity(aboutPopup.employees)[aboutPopup.projects[key].id] : 0;

    projectData.push({
      id: aboutPopup.projects[key].id,
      capacity: aboutPopup.projects[key].capacity,
      currentCapacityProject,
      available: aboutPopup.projects[key].capacity - currentCapacityProject
    });

    const option = createMyElement(
      'option',
      '',
      `${aboutPopup.projects[key].project} 
      (${getNumber(aboutPopup.projects[key].capacity - currentCapacityProject)} / ${aboutPopup.projects[key].capacity})`);
    option.value = key;
    select.append(option);
  }

  const rangeBlock = createMyElement('div');
  select.addEventListener('change', (e) => {
    selectedProject = e.target.value;
    if (
      selectedProject
      && projectData[selectedProject].available > 0
      && !aboutPopup.assignments.includes(projectData[selectedProject].id)
    ) {
      clearDOM(rangeBlock);
      const currentCapacityProject = getNumber(projectData[selectedProject].currentCapacityProject);
      validateRangeCapacity.textContent = '';
      
      const capacityRange = createRange({
        maxValue: 1.5,
        value: aboutPopup.currentCapacityEmployee !== 0 ?
          aboutPopup.maxCapacity - aboutPopup.currentCapacityEmployee :
          1
      });

      const capacityRangeLabel = createLabel({
        labelTitle: 'Capacity Allocation: ',
        value: capacityRange.value,
        hintText: 'Adjust capacity (0.0 - 1.5)',
        range: capacityRange,
        class: 'capacity-range-label-value'
      });

      const fitRange = createRange({
        maxValue: 1.0,
        value: 1
      });

      const fitRangeLabel = createLabel({
        labelTitle: 'Project Fit: ',
        value: fitRange.value,
        hintText: 'Project fit coefficient (0.0 - 1.0)',
        range: fitRange,
        class: 'fit-range-label-value'
      });

      const projectInfo = createMyElement('div', 'project-info');
      const projectCapacity = createMyElement('div', 'info-row', 'Project Capacity:');
      const capacityDefault = projectData[selectedProject].capacity;
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
      const afterAssignmentValue = createMyElement('span', '', `${getNumber(efectiveCapacity + currentCapacityProject)}`);
      const afterAssignmentCapacityValue = createMyElement('span', '', ` / ${capacityDefault}`);
      wrapperElement.append(afterAssignmentValue, afterAssignmentCapacityValue);
      afterAssignment.append(wrapperElement);
      
      projectInfo.append(projectCapacity, efectiveCapacityElement, afterAssignment);
      
      function validate(isValid, msg = '') {
        if (isValid) {
          capacityValue = capacityRange.value;
          fitValue = fitRange.value;
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
          `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${getNumber(efectiveCapacity + currentCapacityProject)})`
        );
      } else {
        validate(true);
      }
      
      rangeBlock.append(capacityRangeLabel, fitRangeLabel, projectInfo);
      if(validateRangeCapacity.textContent !== '') {
        rangeBlock.append(validateRangeCapacity);
      }
      
      const capacityRangeLabelValue = document.querySelector('.capacity-range-label-value');
      const fitRangeLabelValue = document.querySelector('.fit-range-label-value');

      capacityRange.addEventListener('input', (event) => {
        const targetValue = getNumber(event.target.value);
        capacityRangeLabelValue.textContent = targetValue;
        efectiveCapacityValue.textContent = getNumber(targetValue * getNumber(fitRangeLabelValue.textContent));
        const allCapacity = getNumber(getNumber(efectiveCapacityValue.textContent) + currentCapacityProject);
        afterAssignmentValue.textContent = allCapacity;

        if (targetValue === 0 || getNumber(fitRangeLabelValue.textContent) === 0) {
            validate(
              false,
              'Please enter a valid range'
            );
          } else if (aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent) > aboutPopup.maxCapacity) {
            validate(
              false,
              `Employee capacity would exceed ${aboutPopup.maxCapacity} (current: ${aboutPopup.currentCapacityEmployee}, target: ${getNumber(aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent))})`
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

          if (targetValue === 0 || getNumber(capacityRangeLabelValue.textContent) === 0) {
            validate(
              false,
              'Please enter a valid range'
            );
          } else if (aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent) > aboutPopup.maxCapacity) {
            validate(
              false,
              `Employee capacity would exceed ${aboutPopup.maxCapacity} (current: ${aboutPopup.currentCapacityEmployee}, target: ${getNumber(aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent))})`
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
        }
      });

      if (window.innerHeight < parseInt(popup.style.top) + popup.offsetHeight) {
        popup.style.bottom = '20px';
        popup.style.top = 'auto';
      }
      
    } else {
      clearDOM(rangeBlock);
      assignBtn.disabled = true;
      assignBtn.classList.add('disable');
      if (!selectedProject) {
        validateRangeCapacity.textContent = 'Select a project, please!';
      }
      if (selectedProject && aboutPopup.assignments.includes(projectData[selectedProject].id)) {
        validateRangeCapacity.textContent = 'Employee has been allready assigned to project';
      }
      if (selectedProject && projectData[selectedProject].available <= 0) {
        validateRangeCapacity.textContent = 'Available capacity project equal 0';
      }
      if (validateRangeCapacity.textContent !== '') {
        rangeBlock.append(validateRangeCapacity);
      }
    }
  });

  assignBtn.addEventListener('click', () => {
    aboutPopup.monthlyData[`${aboutPopup.year}-${aboutPopup.month}`].employees.forEach((employee) => {
      if (employee.id === aboutPopup.id) {
        employee.assignments.push({
          projectId: projectData[selectedProject].id,
          employeeId: aboutPopup.id,
          capacity: capacityValue,
          fit: fitValue
        });
        localStorage.setItem('monthlyData', JSON.stringify(aboutPopup.monthlyData));
        if (document.querySelector('.popup')) {
          document.body.removeChild(document.querySelector('.popup'));
        }
        getContent(1);
      }
    });
  });

  label.append(select);
  btnBlock.append(assignBtn, assignCnl);
  assignPopupContent.append(label, rangeBlock, btnBlock);

  const popup = createPopup({
    title: `Assign ${aboutPopup.fullName}`,
    text: `Current Capacity: ${aboutPopup.currentCapacityEmployee} / ${aboutPopup.maxCapacity}`,
    subtext: `Available: ${getNumber(aboutPopup.maxCapacity - aboutPopup.currentCapacityEmployee)}`,
    content: assignPopupContent
  });

  document.body.append(popup);

  setPopupPosition(popup, popupPosition);
}