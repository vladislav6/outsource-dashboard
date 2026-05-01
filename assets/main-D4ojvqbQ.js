//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/lists.js
var estIncomePerMonth = {
	totalIncome: {},
	setIncome(period, value) {
		Object.assign(this.totalIncome, { [period]: getNumber(value) });
	},
	getIncome(period) {
		return this.totalIncome[period];
	}
};
var links = [{
	title: "Projects",
	id: 0,
	default: true,
	buttons: {
		addProject: function() {
			let button;
			if (!document.querySelector(".header").hasChildNodes()) button = createMyElement("button", "btn add-project", "+Add project");
			return button;
		},
		seedData: function() {
			let button;
			if (!document.querySelector(".header").hasChildNodes()) button = createMyElement("button", "btn seed-data", "Seed data");
			return button;
		}
	}
}, {
	title: "Employees",
	id: 1,
	default: false,
	buttons: { addEmployee: function() {
		let button;
		if (!document.querySelector(".header").hasChildNodes()) button = createMyElement("button", "btn add-employee", "+Add employee");
		return button;
	} }
}];
var weekDaysName = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var years = [
	2025,
	2026,
	2027
];
var formProject = {
	projectName: {
		label: createMyElement("label", "", "Project Name: *"),
		input: createMyElement("input"),
		type: "text",
		name: "project-name",
		title: "Project name must be at least 3 characters",
		required: true,
		minlength: "3",
		pattern: "[A-Za-z0-9s]+"
	},
	companyName: {
		label: createMyElement("label", "", "Company Name: *"),
		input: createMyElement("input"),
		type: "text",
		name: "company-name",
		title: "Company name must be at least 2 characters",
		required: true,
		minlength: "2",
		pattern: "[A-Za-z0-9s]+"
	},
	budget: {
		label: createMyElement("label", "", "Budget: *"),
		input: createMyElement("input"),
		type: "number",
		name: "project-budget",
		title: "Budget must be greater than 0",
		required: true,
		min: "0.01",
		step: "0.01"
	},
	employeeCapacity: {
		label: createMyElement("label", "", "Employee Capacity: *"),
		input: createMyElement("input"),
		type: "number",
		name: "employee-capacity",
		title: "Employee capacity must be at least 1",
		required: true,
		min: "1",
		step: "1"
	},
	addButton: {
		button: createMyElement("button", "btn addButton disable", "Add"),
		type: "submit",
		disabled: true
	},
	canselButton: {
		button: createMyElement("button", "btn", "Cansel"),
		type: "button",
		disabled: false
	}
};
var formEmployee = {
	employeeName: {
		label: createMyElement("label", "", "Name: *"),
		input: createMyElement("input"),
		type: "text",
		name: "name",
		title: "Name must be at least 3 characters and contain only letters",
		required: true,
		minlength: "3",
		pattern: "[A-Za-z0-9s]+"
	},
	employeeSurname: {
		label: createMyElement("label", "", "Surname: *"),
		input: createMyElement("input"),
		type: "text",
		name: "surname",
		title: "Surname must be at least 3 characters and contain only letters",
		required: true,
		minlength: "3",
		pattern: "[A-Za-z0-9s]+"
	},
	birthday: {
		label: createMyElement("label", "", "Date of Birth: *"),
		input: createMyElement("input"),
		type: "date",
		name: "dob",
		title: "You must be at least 18 years old",
		required: true
	},
	position: {
		label: createMyElement("label", "", "Position: *"),
		input: createMyElement("select"),
		name: "position",
		title: "Please select a position",
		required: true,
		options: {
			defaultOption: createMyElement("option", "", "Select position"),
			junior: createMyElement("option", "", "Junior"),
			middle: createMyElement("option", "", "Middle"),
			senior: createMyElement("option", "", "Senior"),
			lead: createMyElement("option", "", "Lead"),
			architect: createMyElement("option", "", "Architect"),
			BO: createMyElement("option", "", "BO")
		}
	},
	salary: {
		label: createMyElement("label", "", "Salary: *"),
		input: createMyElement("input"),
		type: "number",
		name: "salary",
		title: "Salary must be greater than 0",
		required: true,
		min: .01,
		step: .01
	},
	addButton: {
		button: createMyElement("button", "btn addButton disable", "Add"),
		type: "submit",
		disabled: true
	},
	canselButton: {
		button: createMyElement("button", "btn", "Cansel"),
		type: "button",
		disabled: false
	}
};
//#endregion
//#region src/js/modules/employee-head-table.js
function employeeHeadTable() {
	const tr = createMyElement("tr");
	const thName = createMyElement("th", "", "Name");
	const iconWrapName = createMyElement("div", "icon-wrapper");
	const iconFilterableName = createMyElement("span", "filterable");
	iconFilterableName.setAttribute("data-filter", "name");
	iconFilterableName.setAttribute("data-filter-label", "Name: ");
	const iconSortableName = createMyElement("span", "sortable");
	iconSortableName.setAttribute("data-column", "name");
	iconWrapName.append(iconFilterableName, iconSortableName);
	thName.append(iconWrapName);
	const thSurname = createMyElement("th", "", "Surname");
	const iconWrapSurname = createMyElement("div", "icon-wrapper");
	const iconFilterableSurname = createMyElement("span", "filterable");
	iconFilterableSurname.setAttribute("data-filter", "surname");
	iconFilterableSurname.setAttribute("data-filter-label", "Surname: ");
	const iconSortableSurname = createMyElement("span", "sortable");
	iconSortableSurname.setAttribute("data-column", "surname");
	iconWrapSurname.append(iconFilterableSurname, iconSortableSurname);
	thSurname.append(iconWrapSurname);
	const thAge = createMyElement("th", "", "Age");
	const iconWrapAge = createMyElement("div", "icon-wrapper");
	const iconSortableAge = createMyElement("span", "sortable");
	iconSortableAge.setAttribute("data-column", "dob");
	iconWrapAge.append(iconSortableAge);
	thAge.append(iconWrapAge);
	const thPosition = createMyElement("th", "", "Position");
	const iconWrapPosition = createMyElement("div", "icon-wrapper");
	const iconFilterablePosition = createMyElement("span", "filterable");
	iconFilterablePosition.setAttribute("data-filter", "position");
	iconFilterablePosition.setAttribute("data-filter-label", "Position: ");
	const iconSortablePosition = createMyElement("span", "sortable");
	iconSortablePosition.setAttribute("data-column", "position");
	iconWrapPosition.append(iconFilterablePosition, iconSortablePosition);
	thPosition.append(iconWrapPosition);
	const thSalary = createMyElement("th", "", "Salary");
	const iconWrapSalary = createMyElement("div", "icon-wrapper");
	const iconSortableSalary = createMyElement("span", "sortable");
	iconSortableSalary.setAttribute("data-column", "salary");
	iconWrapSalary.append(iconSortableSalary);
	thSalary.append(iconWrapSalary);
	const thEstimatedPayment = createMyElement("th", "", "Estimated Payment");
	const thProject = createMyElement("th", "", "Project");
	const thProjectedIncome = createMyElement("th", "", "Projected Income");
	const thActions = createMyElement("th", "", "Actions");
	tr.append(thName, thSurname, thAge, thPosition, thSalary, thEstimatedPayment, thProject, thProjectedIncome, thActions);
	return tr;
}
//#endregion
//#region src/js/modules/project-head-table.js
function projectHeadTable() {
	const tr = createMyElement("tr");
	const thNameCompany = createMyElement("th", "", "Company name");
	const iconWrapCompany = createMyElement("div", "icon-wrapper");
	const iconFilterableCompany = createMyElement("span", "filterable");
	iconFilterableCompany.setAttribute("data-filter", "company");
	iconFilterableCompany.setAttribute("data-filter-label", "Company name: ");
	const iconSortableCompany = createMyElement("span", "sortable");
	iconSortableCompany.setAttribute("data-column", "company");
	iconWrapCompany.append(iconFilterableCompany, iconSortableCompany);
	thNameCompany.append(iconWrapCompany);
	const thNameProject = createMyElement("th", "", "Project name");
	const iconWrapProject = createMyElement("div", "icon-wrapper");
	const iconFilterableProject = createMyElement("span", "filterable");
	iconFilterableProject.setAttribute("data-filter", "project");
	iconFilterableProject.setAttribute("data-filter-label", "Project name: ");
	const iconSortableProject = createMyElement("span", "sortable");
	iconSortableProject.setAttribute("data-column", "project");
	iconWrapProject.append(iconFilterableProject, iconSortableProject);
	thNameProject.append(iconWrapProject);
	const thBudget = createMyElement("th", "", "Budget");
	const iconWrapBudget = createMyElement("div", "icon-wrapper");
	const iconSortableBudget = createMyElement("span", "sortable");
	iconSortableBudget.setAttribute("data-column", "budget");
	iconWrapBudget.append(iconSortableBudget);
	thBudget.append(iconWrapBudget);
	const thEmployeeCapacity = createMyElement("th", "", "Employee Capacity");
	const iconWrapCapacity = createMyElement("div", "icon-wrapper");
	const iconSortableCapacity = createMyElement("span", "sortable");
	iconSortableCapacity.setAttribute("data-column", "capacity");
	iconWrapCapacity.append(iconSortableCapacity);
	thEmployeeCapacity.append(iconWrapCapacity);
	const thEmployees = createMyElement("th", "", "Employees");
	const thEstimatedIncome = createMyElement("th", "", "Estimated Income");
	const thActions = createMyElement("th", "", "Action");
	tr.append(thNameCompany, thNameProject, thBudget, thEmployeeCapacity, thEmployees, thEstimatedIncome, thActions);
	return tr;
}
//#endregion
//#region src/js/modules/sortable.js
var removeSort = (selectors) => {
	[...selectors].forEach((element) => {
		if (element.classList.contains("up") || element.classList.contains("down")) {
			element.classList.remove("up");
			element.classList.remove("down");
		}
	});
};
function getSort(data, column, ascending) {
	return data.sort((a, b) => {
		let valueA = a[column];
		let valueB = b[column];
		if (column === "dob") return ascending ? getAge(valueA) - getAge(valueB) : getAge(valueB) - getAge(valueA);
		if (column === "position") {
			const positionPriority = {
				"Junior": 0,
				"Middle": 1,
				"Senior": 2,
				"Lead": 3,
				"Architect": 4,
				"BO": 5
			};
			return ascending ? positionPriority[valueA] - positionPriority[valueB] : positionPriority[valueB] - positionPriority[valueA];
		}
		if (column === "salary") return ascending ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
		valueA = String(valueA).toLowerCase();
		valueB = String(valueB).toLowerCase();
		return ascending ? valueA.localeCompare(valueB, "en") : valueB.localeCompare(valueA, "en");
	});
}
function sortableTool(aboutSort) {
	const { target, table, trThs, pageId, year, month, employees, projects, monthlyData } = aboutSort;
	const ascending = !target.classList.contains("up");
	const column = target.getAttribute("data-column");
	let projectSort = projects;
	let employeeSort = employees;
	if (pageId === 0) projectSort = getSort(projects, column, ascending);
	else employeeSort = getSort(employees, column, ascending);
	drawContentTable({
		isDrawTable: true,
		employees: employeeSort,
		projects: projectSort,
		table,
		trThs,
		pageId,
		year,
		month,
		monthlyData
	});
	removeSort([...document.querySelectorAll(".sortable")].filter((f) => f !== target));
	if (target.classList.contains("up")) {
		target.classList.remove("up");
		target.classList.add("down");
	} else {
		target.classList.remove("down");
		target.classList.add("up");
	}
}
//#endregion
//#region src/js/modules/filterable.js
function filterableTool(aboutFilter, callback) {
	const { target, table, trThs, pageId, year, month, employees, projects, monthlyData } = aboutFilter;
	if (document.querySelector(".filter-tooltip")) removeTooltip(null, "filter-tooltip");
	const filter = target.getAttribute("data-filter");
	const filterLabel = target.getAttribute("data-filter-label");
	const input = createMyElement("input", "filterable-input");
	input.type = "text";
	input.maxLength = 20;
	input.placeholder = `Filter by ${filterLabel}`;
	let projectFilter = projects;
	let employeeFilter = employees;
	createTooltip({
		targetElement: target,
		tooltipClass: "filter-tooltip",
		tooltipStringContent: "",
		tooltipHtmlContent: input,
		position: "start"
	});
	const filterChip = createMyElement("div", "filter-chip");
	filterChip.setAttribute("data-filter", filter);
	let chipLabel = createMyElement("span", "chip-label");
	const removeChip = createMyElement("button", "remove-chip", "x");
	const clearFilter = createMyElement("button", "clear-filter", "Clear Filters");
	filterChip.append(chipLabel, removeChip);
	const conteiner = document.querySelector(".filters-conteiner");
	let hasChip = false;
	if (conteiner.hasChildNodes()) {
		hasChip = [...document.querySelectorAll(".filter-chip")].some((chip) => chip.getAttribute("data-filter") === filter);
		if (hasChip) chipLabel = [...document.querySelectorAll(".filter-chip")].filter((chip) => chip.getAttribute("data-filter") === filter)[0].querySelector(".chip-label");
	}
	input.addEventListener("input", () => {
		if (input.value.length > 0 && input.value.length <= 20) {
			if (!conteiner.hasChildNodes() || !hasChip) if (document.querySelector(".clear-filter")) conteiner.insertBefore(filterChip, document.querySelector(".clear-filter"));
			else conteiner.append(filterChip);
			if (document.querySelectorAll(".filter-chip").length > 1 && !document.querySelector(".clear-filter")) conteiner.append(clearFilter);
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
//#endregion
//#region src/js/modules/editable.js
function changePosition(data) {
	const { monthlyData, year, month, td, id } = data;
	const select = createMyElement("select", "select-position");
	const defaultOption = createMyElement("option", "", "Select");
	const junior = createMyElement("option", "", "Junior");
	const middle = createMyElement("option", "", "Middle");
	const senior = createMyElement("option", "", "Senior");
	const lead = createMyElement("option", "", "Lead");
	const architect = createMyElement("option", "", "Architect");
	const bo = createMyElement("option", "", "BO");
	select.append(defaultOption, junior, middle, senior, lead, architect, bo);
	td.append(select);
	select.addEventListener("change", () => {
		monthlyData[`${year}-${month}`].employees.forEach((employee) => {
			if (employee.id === id) {
				employee.position = select.value;
				localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
				getContent(1);
			}
		});
	});
}
function changeSalary(data) {
	const { monthlyData, year, month, td, id } = data;
	const input = createMyElement("input", "input-salary");
	input.type = "number";
	input.value = Number(td.textContent.slice(1));
	td.append(input);
	let currentSalary = input.value;
	const onChangeSalary = () => {
		if (currentSalary !== input.value && Number(input.value) > 0) monthlyData[`${year}-${month}`].employees.forEach((employee) => {
			if (employee.id === id) {
				employee.salary = input.value;
				localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
				getContent(1);
				input.value = 0;
			}
		});
	};
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter") onChangeSalary();
	});
	document.addEventListener("click", () => {
		onChangeSalary();
	});
}
function editableTool(aboutEdit) {
	const { target, monthlyData, year, month } = aboutEdit;
	const id = target.getAttribute("data-id");
	if (target.classList.contains("position")) {
		cancelEdit(".select-position");
		changePosition({
			monthlyData,
			year,
			month,
			td: target,
			id
		});
	}
	if (target.classList.contains("salary")) {
		cancelEdit(".input-salary");
		changeSalary({
			monthlyData,
			year,
			month,
			td: target,
			id
		});
	}
	target.classList.remove("editable");
}
//#endregion
//#region src/js/common/defualtData.json
var defualtData_default = { "2025-0": {
	"projects": [
		{
			"id": "740537",
			"project": "LandingPageRedesign",
			"company": "PixelForgeStudio",
			"budget": "18500",
			"capacity": "3"
		},
		{
			"id": "720231",
			"project": "MobileAppUIDesign",
			"company": "NovaDigital",
			"budget": "32000",
			"capacity": "4"
		},
		{
			"id": "044328",
			"project": "BrandIdentityRefresh",
			"company": "LuminaCreative",
			"budget": "14500",
			"capacity": "2"
		},
		{
			"id": "768299",
			"project": "EcommerceProductCatalog",
			"company": "ShopSphereInc",
			"budget": "27800",
			"capacity": "5"
		},
		{
			"id": "164039",
			"project": "CorporateDashboardDevelopment",
			"company": "VertexSolutions",
			"budget": "41200",
			"capacity": "4"
		},
		{
			"id": "380766",
			"project": "SEOOptimizationCampaign",
			"company": "GrowthPathAgency",
			"budget": "9800",
			"capacity": "2"
		},
		{
			"id": "063710",
			"project": "CustomCRMIntegration",
			"company": "StreamlineTech",
			"budget": "36500",
			"capacity": "5"
		},
		{
			"id": "059303",
			"project": "SocialMediaAutomationTool",
			"company": "ConnectlyLabs",
			"budget": "22400",
			"capacity": "3"
		},
		{
			"id": "961441",
			"project": "WebsitePerformanceAudit",
			"company": "SwiftByte",
			"budget": "8700",
			"capacity": "1"
		},
		{
			"id": "644931",
			"project": "AIChatbotImplementation",
			"company": "IntelliMindSystems",
			"budget": "29500",
			"capacity": "4"
		},
		{
			"id": "192772",
			"project": "MobileWalletPrototype",
			"company": "FinoraInnovations",
			"budget": "31800",
			"capacity": "5"
		},
		{
			"id": "696471",
			"project": "ContentManagementSystem",
			"company": "ContentFlow",
			"budget": "25100",
			"capacity": "3"
		},
		{
			"id": "880583",
			"project": "EmailMarketingPlatform",
			"company": "MailPulse",
			"budget": "16700",
			"capacity": "2"
		},
		{
			"id": "315197",
			"project": "InventoryManagementApp",
			"company": "StockWise",
			"budget": "28900",
			"capacity": "4"
		},
		{
			"id": "810601",
			"project": "CompanyPortfolioWebsite",
			"company": "ElevateStudio",
			"budget": "12400",
			"capacity": "2"
		},
		{
			"id": "872088",
			"project": "DataVisualizationTool",
			"company": "InsightGrid",
			"budget": "33400",
			"capacity": "5"
		},
		{
			"id": "892948",
			"project": "PaymentGatewayIntegration",
			"company": "PayForge",
			"budget": "19800",
			"capacity": "3"
		},
		{
			"id": "680607",
			"project": "HRManagementSystem",
			"company": "TalentFlow",
			"budget": "27600",
			"capacity": "4"
		},
		{
			"id": "753621",
			"project": "VirtualEventPlatform",
			"company": "EventSphere",
			"budget": "21500",
			"capacity": "3"
		},
		{
			"id": "746628",
			"project": "SaaSAnalyticsDashboard",
			"company": "Metricly",
			"budget": "39200",
			"capacity": "5"
		}
	],
	"employees": [
		{
			"id": "910894",
			"name": "Abigail",
			"surname": "Jackson",
			"dob": "1998-04-10",
			"salary": "1715",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "534631",
			"name": "Emily",
			"surname": "Ramirez",
			"dob": "1985-04-29",
			"salary": "6464",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "002334",
			"name": "Mia",
			"surname": "White",
			"dob": "1988-06-02",
			"salary": "1350",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "770407",
			"name": "Ethan",
			"surname": "Martinez",
			"dob": "1986-09-23",
			"salary": "1201",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "288770",
			"name": "Lucas",
			"surname": "Jones",
			"dob": "2000-12-21",
			"salary": "5949",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "866725",
			"name": "Andrew",
			"surname": "Miller",
			"dob": "1986-11-21",
			"salary": "2757",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "040736",
			"name": "Samuel",
			"surname": "Jones",
			"dob": "1988-06-11",
			"salary": "2605",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "024269",
			"name": "Ava",
			"surname": "Lewis",
			"dob": "1984-06-14",
			"salary": "4681",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "045914",
			"name": "Avery",
			"surname": "Davis",
			"dob": "2003-08-08",
			"salary": "1252",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "492066",
			"name": "Emily",
			"surname": "Lee",
			"dob": "1995-04-09",
			"salary": "2905",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "512506",
			"name": "Jack",
			"surname": "Davis",
			"dob": "1993-12-29",
			"salary": "2912",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "164697",
			"name": "Sophia",
			"surname": "Miller",
			"dob": "1980-08-09",
			"salary": "1035",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "193335",
			"name": "Lucas",
			"surname": "Rodriguez",
			"dob": "2002-11-15",
			"salary": "1697",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "712041",
			"name": "James",
			"surname": "Thomas",
			"dob": "1996-01-09",
			"salary": "2897",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "561776",
			"name": "Sofia",
			"surname": "Martin",
			"dob": "2003-12-16",
			"salary": "4168",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "940077",
			"name": "Daniel",
			"surname": "Brown",
			"dob": "1994-02-09",
			"salary": "1488",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "160642",
			"name": "Amelia",
			"surname": "Hernandez",
			"dob": "1987-05-07",
			"salary": "2922",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "746505",
			"name": "Isabella",
			"surname": "Martinez",
			"dob": "1981-08-23",
			"salary": "940",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "621165",
			"name": "Ethan",
			"surname": "Anderson",
			"dob": "1999-07-15",
			"salary": "3124",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "527698",
			"name": "Harper",
			"surname": "Taylor",
			"dob": "1992-03-12",
			"salary": "5123",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "091909",
			"name": "William",
			"surname": "Garcia",
			"dob": "1991-11-20",
			"salary": "2489",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "357465",
			"name": "Charlotte",
			"surname": "Thompson",
			"dob": "1997-06-18",
			"salary": "1420",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "299308",
			"name": "Benjamin",
			"surname": "Wilson",
			"dob": "1989-09-05",
			"salary": "5780",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "083548",
			"name": "Evelyn",
			"surname": "Moore",
			"dob": "1995-01-30",
			"salary": "2650",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "483991",
			"name": "Henry",
			"surname": "Clark",
			"dob": "2001-05-22",
			"salary": "1580",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "358780",
			"name": "Elizabeth",
			"surname": "Rodriguez",
			"dob": "1983-12-08",
			"salary": "4890",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "552153",
			"name": "Alexander",
			"surname": "Lee",
			"dob": "1990-04-17",
			"salary": "3200",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "983033",
			"name": "Mia",
			"surname": "Harris",
			"dob": "1998-10-25",
			"salary": "1650",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "385935",
			"name": "Jack",
			"surname": "Martin",
			"dob": "1994-07-03",
			"salary": "4300",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "862297",
			"name": "Sophia",
			"surname": "Anderson",
			"dob": "2000-02-14",
			"salary": "2750",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "314200",
			"name": "David",
			"surname": "Thomas",
			"dob": "1987-08-19",
			"salary": "5200",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "164818",
			"name": "Olivia",
			"surname": "White",
			"dob": "1996-11-11",
			"salary": "1380",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "641553",
			"name": "Michael",
			"surname": "Perez",
			"dob": "1993-03-28",
			"salary": "2950",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "687156",
			"name": "Ava",
			"surname": "Gonzalez",
			"dob": "1989-06-15",
			"salary": "6100",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "888535",
			"name": "James",
			"surname": "Robinson",
			"dob": "2002-09-07",
			"salary": "1120",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "501914",
			"name": "Emma",
			"surname": "Clark",
			"dob": "1991-12-01",
			"salary": "3100",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "538402",
			"name": "Daniel",
			"surname": "Lewis",
			"dob": "1984-05-10",
			"salary": "5500",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "007563",
			"name": "Isabella",
			"surname": "Walker",
			"dob": "1997-04-22",
			"salary": "2680",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "511070",
			"name": "Lucas",
			"surname": "Hall",
			"dob": "2001-10-30",
			"salary": "1490",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "526422",
			"name": "Charlotte",
			"surname": "Young",
			"dob": "1986-01-12",
			"salary": "4800",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "937900",
			"name": "Henry",
			"surname": "Allen",
			"dob": "1995-08-27",
			"salary": "2850",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "490118",
			"name": "Amelia",
			"surname": "King",
			"dob": "1999-02-19",
			"salary": "1320",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "628057",
			"name": "William",
			"surname": "Wright",
			"dob": "1988-07-09",
			"salary": "5900",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "161485",
			"name": "Sophia",
			"surname": "Scott",
			"dob": "1993-05-05",
			"salary": "3050",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "991492",
			"name": "Alexander",
			"surname": "Green",
			"dob": "1982-11-18",
			"salary": "6400",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "713978",
			"name": "Mia",
			"surname": "Baker",
			"dob": "2000-06-23",
			"salary": "1550",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "134697",
			"name": "Ethan",
			"surname": "Adams",
			"dob": "1994-09-14",
			"salary": "2780",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "966064",
			"name": "Olivia",
			"surname": "Nelson",
			"dob": "1987-03-03",
			"salary": "4650",
			"position": "Senior",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "137148",
			"name": "Benjamin",
			"surname": "Carter",
			"dob": "1996-12-12",
			"salary": "2920",
			"position": "Middle",
			"assignments": [],
			"vacationDays": []
		},
		{
			"id": "816363",
			"name": "Alex",
			"surname": "Johnson",
			"dob": "1998-05-12",
			"salary": "1200",
			"position": "Junior",
			"assignments": [],
			"vacationDays": []
		}
	]
} };
//#endregion
//#region src/js/modules/content.js
function setDataToLocalStorage() {
	if (localStorage.getItem("monthlyData")) {
		const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
		const month = getCurrentPeriod().month;
		const year = getCurrentPeriod().year;
		for (let key in monthlyData) if (monthlyData[key].projects.length === 0 && monthlyData[key].employees.length === 0) delete monthlyData[key];
		if (!monthlyData.hasOwnProperty(`${year}-${month}`)) {
			monthlyData[`${year}-${month}`] = {
				projects: [],
				employees: []
			};
			localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
		}
	}
}
document.querySelector(".months").addEventListener("change", setDataToLocalStorage);
document.querySelector(".years").addEventListener("change", setDataToLocalStorage);
window.addEventListener("pagehide", () => {
	const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
	for (let key in monthlyData) if (monthlyData[key].projects.length === 0 && monthlyData[key].employees.length === 0) delete monthlyData[key];
	Object.keys(monthlyData).length !== 0 ? localStorage.setItem("monthlyData", JSON.stringify(monthlyData)) : localStorage.removeItem("monthlyData");
});
window.addEventListener("load", () => {
	const month = getCurrentPeriod().month;
	const year = getCurrentPeriod().year;
	const initialData = {
		...defualtData_default,
		[`${year}-${month}`]: {
			projects: [],
			employees: []
		}
	};
	if (!localStorage.getItem("monthlyData")) localStorage.setItem("monthlyData", JSON.stringify(initialData));
	else {
		const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
		if (!monthlyData.hasOwnProperty(`${year}-${month}`)) {
			Object.assign(monthlyData, initialData);
			localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
		}
	}
});
function getNewFilteredData(data) {
	let result = [];
	[...document.querySelectorAll(".filter-chip")].forEach((chip) => {
		const filterValue = chip.querySelector(".chip-label").textContent.split(": ")[1];
		result = filterData(data, chip.getAttribute("data-filter"), filterValue);
	});
	return result;
}
function getContent(pageId, key = "") {
	const main = document.querySelector(".main");
	const filtersConteiner = createMyElement("div", "filters-conteiner");
	clearDOM(main);
	main.prepend(filtersConteiner);
	let year = 0;
	let month = 0;
	let isDrawTable = true;
	if (key) {
		const per = key.split("-");
		year = Number(per[0]);
		month = Number(per[1]);
		isDrawTable = false;
	} else {
		month = getCurrentPeriod().month;
		year = getCurrentPeriod().year;
	}
	if (localStorage.getItem("monthlyData")) {
		const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
		if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
			let employees = monthlyData[`${year}-${month}`].employees;
			let projects = monthlyData[`${year}-${month}`].projects;
			if (!isDrawTable) estIncomePerMonth.setIncome(`${year}-${month}`, projectTable(year, month, isDrawTable, monthlyData, employees, projects));
			else {
				const table = createMyElement("table", "table");
				const mainData = {
					table,
					trThs: pageId === 0 ? projectHeadTable() : employeeHeadTable(),
					pageId,
					year,
					month,
					monthlyData
				};
				const fullTable = drawContentTable({
					isDrawTable,
					employees,
					projects,
					...mainData
				});
				main.append(fullTable);
				table.addEventListener("click", (e) => {
					if (e.target.classList.contains("sortable")) {
						if (document.querySelectorAll(".filter-chip").length > 0) if (pageId === 0) projects = getNewFilteredData(projects);
						else employees = getNewFilteredData(employees);
						sortableTool({
							target: e.target,
							employees,
							projects,
							...mainData
						});
					}
					if (e.target.classList.contains("filterable")) filterableTool({
						target: e.target,
						employees,
						projects,
						...mainData
					}, (data) => {
						if (pageId === 0) projects = data;
						else employees = data;
					});
					if (e.target.classList.contains("editable")) editableTool({
						target: e.target,
						monthlyData,
						year,
						month
					});
				});
				filtersConteiner.addEventListener("click", (e) => {
					if (e.target.classList.contains("clear-filter")) {
						clearDOM(filtersConteiner);
						employees = monthlyData[`${year}-${month}`].employees;
						projects = monthlyData[`${year}-${month}`].projects;
						drawContentTable({
							isDrawTable: true,
							employees,
							projects,
							...mainData
						});
					}
					if (e.target.classList.contains("remove-chip")) {
						employees = monthlyData[`${year}-${month}`].employees;
						projects = monthlyData[`${year}-${month}`].projects;
						filtersConteiner.removeChild(e.target.parentNode);
						if (document.querySelectorAll(".filter-chip").length <= 1 && document.querySelector(".clear-filter")) filtersConteiner.removeChild(document.querySelector(".clear-filter"));
						if (document.querySelectorAll(".filter-chip").length > 0) if (pageId === 0) projects = getNewFilteredData(projects);
						else employees = getNewFilteredData(employees);
						drawContentTable({
							isDrawTable: true,
							employees,
							projects,
							...mainData
						});
					}
				});
				if (pageId === 0) {
					const totalEstIncome = [...table.querySelectorAll(".income")].reduce((acc, tdElement) => {
						const income = Number(tdElement.textContent.slice(1));
						return acc += income;
					}, 0);
					const incomeClass = totalEstIncome >= 0 ? "profit" : "loss";
					const totalIncome = createMyElement("p", "total-income", "Total Estimated Income: ");
					const total = createMyElement("span", `total ${incomeClass}`, `$${totalEstIncome.toFixed(2)}`);
					totalIncome.append(total);
					main.append(totalIncome);
				}
				document.addEventListener("click", (e) => {
					if (document.querySelector(".popup") && !document.querySelector(".popup").contains(e.target) && !e.target.classList.contains("assign") && !document.querySelector(".overlay")) document.body.removeChild(document.querySelector(".popup"));
					if (!e.target.classList.contains("position")) cancelEdit(".select-position");
					if (!e.target.classList.contains("salary")) {
						if (!e.target.classList.contains("input-salary")) cancelEdit(".input-salary");
					}
					if (document.querySelector(".filter-tooltip") && !e.target.classList.contains("filterable-input") && !e.target.classList.contains("filterable-btn") && !e.target.classList.contains("filter-tooltip") && !e.target.classList.contains("filterable")) removeTooltip(null, "filter-tooltip");
				});
			}
		}
	}
}
document.querySelector(".months").addEventListener("change", () => {
	getContent(Number(document.querySelector(".active").getAttribute("data-id")));
});
document.querySelector(".years").addEventListener("change", () => {
	getContent(Number(document.querySelector(".active").getAttribute("data-id")));
});
links.forEach((link) => {
	if (link.default) window.addEventListener("load", () => getContent(link.id));
});
//#endregion
//#region src/js/modules/edit-assign.js
function editAssign(popupPosition, aboutEdit) {
	let capacityRangeValue = Number(aboutEdit.capacity);
	let fitRangeValue = Number(aboutEdit.fit);
	const effectiveCapacity = Number(aboutEdit.effectiveCapacity);
	const projectCapacity = Number(aboutEdit.projectCapacity);
	const editAssign = createMyElement("div", "popup-content");
	let editBtn = createMyElement("button", "btn assign-btn", "Edit");
	const editCnl = createMyElement("button", "btn assign-cnl", "Cancel");
	const btnBlock = createMyElement("div", "assign-btn-block");
	const errorValidate = createMyElement("p", "validate-range-capacity");
	editCnl.addEventListener("click", closePopup);
	const capacityRange = createRange({
		maxValue: 1.5,
		value: capacityRangeValue
	});
	const availableEmployeeCapacity = aboutEdit.employeeCapacity < 1.5 ? Math.floor((1.5 - aboutEdit.employeeCapacity) * 10) / 10 : 0;
	let hintEmployeeCapacity = capacityRangeValue;
	if (getNumber(availableEmployeeCapacity + capacityRangeValue) <= 1.5) hintEmployeeCapacity = getNumber(availableEmployeeCapacity + capacityRangeValue);
	const capacityRangeLabel = createLabel({
		labelTitle: "Capacity ",
		value: capacityRange.value,
		hintText: `Available range: (0.1 - 1.5)`,
		range: capacityRange,
		class: "capacity-range-edit"
	});
	const fitRange = createRange({
		maxValue: 1,
		value: fitRangeValue
	});
	const fitRangeLabel = createLabel({
		labelTitle: "Fit ",
		value: fitRange.value,
		hintText: `Available range: (0.1 - 1.0)`,
		range: fitRange,
		class: "fit-range-edit"
	});
	let newEffectiveCapacity = capacityRangeValue * fitRangeValue;
	const remainderCapacity = effectiveCapacity - newEffectiveCapacity;
	let isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) > 0;
	let isActiveEmployee = aboutEdit.employeeCapacity <= 1.5;
	editBtn = isActiveEmployee && isActiveProject ? onActiveButton(editBtn) : onDisableButton(editBtn);
	capacityRange.addEventListener("input", (e) => {
		const currentValue = Number(e.target.value);
		document.querySelector(".capacity-range-edit").textContent = currentValue;
		newEffectiveCapacity = getNumber(currentValue * fitRange.value);
		isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) > 0;
		isActiveEmployee = currentValue <= hintEmployeeCapacity;
		editBtn = isActiveEmployee && isActiveProject ? onActiveButton(editBtn) : onDisableButton(editBtn);
		if (!isActiveProject) {
			editAssign.append(errorValidate);
			errorValidate.textContent = `Project capacity would be less than ${projectCapacity}`;
		}
		if (!isActiveEmployee) {
			editAssign.append(errorValidate);
			errorValidate.textContent = "Employee capacity would be less than 1.5";
		}
		if (isActiveEmployee && isActiveProject && editAssign.contains(errorValidate)) editAssign.removeChild(errorValidate);
	});
	fitRange.addEventListener("input", (e) => {
		const currentValue = Number(e.target.value);
		document.querySelector(".fit-range-edit").textContent = currentValue;
		newEffectiveCapacity = getNumber(currentValue * capacityRange.value);
		isActiveProject = projectCapacity - (remainderCapacity + newEffectiveCapacity) >= 0;
		isActiveEmployee = capacityRange.value <= hintEmployeeCapacity;
		editBtn = isActiveProject && isActiveEmployee ? onActiveButton(editBtn) : onDisableButton(editBtn);
		if (!isActiveEmployee) {
			editAssign.append(errorValidate);
			errorValidate.textContent = "Employee capacity would be less than 1.5";
		}
		if (!isActiveProject) {
			editAssign.append(errorValidate);
			errorValidate.textContent = `Project capacity would be less than ${projectCapacity}`;
		}
		if (isActiveEmployee && isActiveProject && editAssign.contains(errorValidate)) editAssign.removeChild(errorValidate);
	});
	editBtn.addEventListener("click", () => {
		const monthlyData = localStorage.getItem("monthlyData") ? JSON.parse(localStorage.getItem("monthlyData")) : {};
		monthlyData[`${aboutEdit.year}-${aboutEdit.month}`].employees.forEach((employee) => {
			if (employee.id === aboutEdit.employeeId) {
				for (let assign in employee.assignments) if (employee.assignments[assign].projectId === aboutEdit.projectId) {
					employee.assignments[assign].capacity = capacityRange.value;
					employee.assignments[assign].fit = fitRange.value;
				}
				localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
				getContent(Number(document.querySelector(".active").getAttribute("data-id")));
				document.body.removeChild(document.querySelector(".popup"));
				document.body.removeChild(document.querySelector(".overlay"));
			}
		});
	});
	btnBlock.append(editBtn, editCnl);
	editAssign.append(capacityRangeLabel, fitRangeLabel, btnBlock);
	const popup = createPopup({
		title: `Edit Assignment`,
		text: aboutEdit.isProject ? `${aboutEdit.name} on ${aboutEdit.project}` : `${aboutEdit.project} on ${aboutEdit.name}`,
		subtext: "",
		content: editAssign
	});
	document.body.append(popup);
	setPopupPosition(popup, popupPosition);
}
//#endregion
//#region src/js/modules/unassign.js
function unassign(details) {
	const { modalTitle, thTitle, name, employeeId, projectId, employeeCapacity, project, cost, revenue, profit, projectBudjet, projectCapacity, projectCapacityDefault, year, month } = details;
	const financialDetails = createMyElement("div", "unassign-info");
	const assignedCapacity = createMyElement("div", "financ-detail", "Assigned Capacity:");
	const assignedCapacityValue = createMyElement("span", "", employeeCapacity);
	assignedCapacity.append(assignedCapacityValue);
	const employeeSalaryShare = createMyElement("div", "financ-detail", "Employee Salary Share:");
	const employeeSalaryShareValue = createMyElement("span", "", `$${cost}`);
	employeeSalaryShare.append(employeeSalaryShareValue);
	const budgetShare = createMyElement("div", "financ-detail", "Budget Share:");
	const budgetShareValue = createMyElement("span", "", `$${revenue}`);
	budgetShare.append(budgetShareValue);
	const incomeClassEEI = profit >= 0 ? "profit" : "loss";
	const employeeEstIncome = createMyElement("div", "financ-detail", "Employee Estimated Income:");
	const employeeEstIncomeValue = createMyElement("span", `income ${incomeClassEEI}`, `$${getNumber(profit)}`);
	employeeEstIncome.append(employeeEstIncomeValue);
	const currentProjectCapacity = createMyElement("div", "financ-detail", "Current Project Capacity:");
	const currentProjectCapacityValue = createMyElement("span", "", `${getNumber(projectCapacity)} / ${projectCapacityDefault}`);
	currentProjectCapacity.append(currentProjectCapacityValue);
	const capacityAfterUnassignment = createMyElement("div", "financ-detail", "Capacity After Unassignment:");
	const capacityAfterUnassignmentValue = createMyElement("span", "", `${getNumber(projectCapacity - employeeCapacity)} / ${projectCapacityDefault}`);
	capacityAfterUnassignment.append(capacityAfterUnassignmentValue);
	const PIN = getNumber(projectBudjet - cost);
	const incomeClassPIN = PIN >= 0 ? "profit" : "loss";
	const projectIncomeNow = createMyElement("div", "financ-detail", "Project Income Now:");
	const projectIncomeNowValue = createMyElement("span", `income ${incomeClassPIN}`, `$${PIN}`);
	projectIncomeNow.append(projectIncomeNowValue);
	const PIA = getNumber(PIN + cost);
	const incomeClassPIA = PIA >= 0 ? "profit" : "loss";
	const projectIncomeAfter = createMyElement("div", "financ-detail", "Project Income After:");
	const projectIncomeAfterValue = createMyElement("span", `income ${incomeClassPIA}`, `$${PIA}`);
	projectIncomeAfter.append(projectIncomeAfterValue);
	const unassignBtn = createMyElement("button", "btn assign-btn", "Unassign");
	const unassignCnl = createMyElement("button", "btn assign-cnl", "Cancel");
	const btnBlock = createMyElement("div", "assign-btn-block");
	btnBlock.append(unassignBtn, unassignCnl);
	unassignBtn.addEventListener("click", () => {
		if (localStorage.getItem("monthlyData")) {
			const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
			monthlyData[`${year}-${month}`].employees.forEach((employee) => {
				if (employee.id === details.employeeId) {
					const assings = employee.assignments.filter((assign) => assign.projectId !== projectId);
					employee.assignments = assings;
					localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
					[...document.querySelectorAll(".overlay")].forEach((element) => document.body.removeChild(element));
					getContent(Number(document.querySelector(".active").getAttribute("data-id")));
					const overlay = getDetailsTable({
						modalTitle,
						thTitle,
						assign: thTitle === "Employee" ? getAllAssignments(monthlyData[`${year}-${month}`].employees).filter((f) => f.projectId === projectId) : assings,
						projects: monthlyData[`${year}-${month}`].projects,
						employees: monthlyData[`${year}-${month}`].employees,
						year,
						month
					});
					document.body.append(overlay.overlay);
				}
			});
		}
	});
	unassignCnl.addEventListener("click", () => document.body.removeChild(overlay));
	financialDetails.append(assignedCapacity, employeeSalaryShare, budgetShare, employeeEstIncome, currentProjectCapacity, capacityAfterUnassignment, projectIncomeNow, projectIncomeAfter, btnBlock);
	const overlay = createModal({
		title: "Unassign Confirmation",
		text: `You want to unassign ${name} (${employeeCapacity} capacity) from ${project}?`,
		item: "unassign",
		content: financialDetails
	});
	document.body.append(overlay);
}
//#endregion
//#region src/js/modules/details.js
function getDetailsTable(details) {
	let profitSum = 0;
	const table = createMyElement("table", "table");
	const tr = createMyElement("tr");
	const th = createMyElement("th", "", `${details.thTitle}`);
	const thCapacity = createMyElement("th", "", "Capacity");
	const thFit = createMyElement("th", "", "Fit");
	const thVacation = createMyElement("th", "", "Vacation");
	const thEffective = createMyElement("th", "", "Effective");
	const thRevenue = createMyElement("th", "", "Revenue");
	const thCost = createMyElement("th", "", "Cost");
	const thProfit = createMyElement("th", "", "Profit");
	const thActions = createMyElement("th", "", "Actions");
	tr.append(th, thCapacity, thFit, thVacation, thEffective, thRevenue, thCost, thProfit, thActions);
	table.append(tr);
	if (details.assign && details.assign.length !== 0) {
		const projectDetails = {};
		const employeeDetails = {};
		const effectiveCapacity = [];
		details.projects.forEach((project) => projectDetails[project.id] = {
			"project": project.project,
			"budget": project.budget,
			"capacity": project.capacity
		});
		details.employees.forEach((employee, index) => employeeDetails[employee.id] = {
			"id": employee.id,
			"name": employee.name,
			"surname": employee.surname,
			"salary": employee.salary,
			"vacation": employee.vacationDays,
			"assignments": employee.assignments
		});
		for (let key in details.assign) {
			const { projectId, employeeId, capacity, fit } = details.assign[key];
			if (employeeDetails.hasOwnProperty(employeeId)) {
				const title = details.thTitle === "Employee" ? `${employeeDetails[employeeId].name} ${employeeDetails[employeeId].surname}` : projectDetails[projectId].project;
				const workingDays = getWorkDaysInMonth(details.year, details.month);
				const vacationWorkingDays = employeeDetails[employeeId].vacation ? employeeDetails[employeeId].vacation.length : 0;
				const vacationCoefficient = (workingDays - vacationWorkingDays) / workingDays;
				const currentCapacityProject = getEmployeeAssignmentsCountCapacity(details.employees)[projectId] ? getEmployeeAssignmentsCountCapacity(details.employees)[projectId] : 0;
				effectiveCapacity.push(getNumber(capacity * fit * vacationCoefficient));
				const usedEffectiveCapacity = getNumber(effectiveCapacity.reduce((acc, capacity) => acc += capacity));
				const capacityForRevenue = Math.max(currentCapacityProject, usedEffectiveCapacity);
				const employeeRevenue = getNumber(getNumber(getNumber(projectDetails[projectId].budget) / capacityForRevenue) * effectiveCapacity[key]);
				const payment = getNumber(employeeDetails[employeeId].salary * Math.max(.5, capacity));
				const profit = employeeRevenue - payment;
				profitSum += profit;
				const incomeClass = profit >= 0 ? "profit" : "loss";
				const tr = createMyElement("tr");
				const tdName = createMyElement("td", "", title);
				const tdCapacity = createMyElement("td", "", `${capacity}`);
				const tdFit = createMyElement("td", "", `${fit}`);
				const tdVacation = createMyElement("td", "", `${vacationWorkingDays !== 0 ? `${vacationWorkingDays} days` : "-"}`);
				const tdEffective = createMyElement("td", "", `${effectiveCapacity[key].toFixed(3)}`);
				const tdRevenue = createMyElement("td", "", `$${employeeRevenue.toFixed(2)}`);
				const tdCost = createMyElement("td", "", `$${payment.toFixed(2)}`);
				const tdProfit = createMyElement("td", `income income-details ${incomeClass}`, `$${profit.toFixed(2)}`);
				const tdActions = createMyElement("td");
				const editBtn = createMyElement("button", "btn assign-edit", "Edit");
				const unassignBtn = createMyElement("button", "btn assign-del", "Unassign");
				const aboutPopup = {
					isProject: details.thTitle === "Employee",
					name: title,
					projectId,
					employeeId,
					project: details.thTitle === "Employee" ? projectDetails[projectId].project : `${employeeDetails[employeeId].name} ${employeeDetails[employeeId].surname}`,
					capacity,
					fit,
					effectiveCapacity: currentCapacityProject,
					projectCapacity: projectDetails[projectId].capacity,
					employeeCapacity: getEmployeeCurrentCapacity(employeeDetails[employeeId].assignments),
					year: details.year,
					month: details.month
				};
				editBtn.addEventListener("click", () => {
					if (document.querySelector(".popup")) {
						document.body.removeChild(document.querySelector(".popup"));
						editAssign(editBtn.getBoundingClientRect(), aboutPopup);
					} else editAssign(editBtn.getBoundingClientRect(), aboutPopup);
				});
				unassignBtn.addEventListener("click", () => unassign({
					modalTitle: details.modalTitle,
					thTitle: details.thTitle,
					name: `${employeeDetails[employeeId].name} ${employeeDetails[employeeId].surname}`,
					employeeId,
					projectId,
					employeeCapacity: usedEffectiveCapacity,
					project: projectDetails[projectId].project,
					cost: payment,
					revenue: employeeRevenue,
					profit,
					projectBudjet: projectDetails[projectId].budget,
					projectCapacity: currentCapacityProject,
					projectCapacityDefault: projectDetails[projectId].capacity,
					year: details.year,
					month: details.month
				}));
				tdActions.append(editBtn, unassignBtn);
				tr.append(tdName, tdCapacity, tdFit, tdVacation, tdEffective, tdRevenue, tdCost, tdProfit, tdActions);
				table.append(tr);
			}
		}
	} else {
		const trNoData = noData(9, "No assignments for this employee.");
		table.append(trNoData);
	}
	const overlay = createModal({
		title: details.modalTitle,
		text: "",
		item: "",
		content: table
	});
	overlay.addEventListener("click", (e) => {
		if (document.querySelector(".popup") && !document.querySelector(".popup").contains(e.target) && !e.target.classList.contains("assign-edit")) document.body.removeChild(document.querySelector(".popup"));
	});
	return {
		overlay,
		profit: profitSum
	};
}
//#endregion
//#region src/js/modules/projects.js
function projectTable(year, month, isDrawTable, monthlyData, employees, projects) {
	const trTds = [];
	let totalIncome = 0;
	const countCapacity = getEmployeeAssignmentsCountCapacity(employees);
	const counts = {};
	const assignments = getAllAssignments(employees);
	assignments.forEach((assign) => assign ? counts[assign.projectId] = (counts[assign.projectId] || 0) + 1 : "");
	if (projects && projects.length !== 0) for (let key in projects) {
		const { id, project, company, budget, capacity } = projects[key];
		const currentCapacity = countCapacity[id] ? countCapacity[id] : 0;
		const overlay = getDetailsTable({
			modalTitle: `Employees on ${project}`,
			thTitle: "Employee",
			assign: assignments.filter((f) => f.projectId === id),
			projects,
			employees,
			year,
			month
		});
		totalIncome += overlay.profit;
		const incomeClass = overlay.profit >= 0 ? "profit" : "loss";
		const tr = createMyElement("tr");
		const tdCompany = createMyElement("td", "", company);
		const tdProject = createMyElement("td", "", project);
		const tdBudget = createMyElement("td", "", `$${Number(budget).toFixed(2)}`);
		const tdCapacity = createMyElement("td", "", `${currentCapacity.toFixed(1)} / ${capacity}`);
		const tdEmployees = createMyElement("td");
		const tdIncome = createMyElement("td", `income ${incomeClass}`, `$${overlay.profit.toFixed(2)}`);
		const tdActions = createMyElement("td");
		const deleteProject = createMyElement("button", "btn delete", "Delete");
		if (counts[id]) {
			const employeeBtn = createMyElement("button", "btn assignments", `Employees (${counts[id]})`);
			employeeBtn.addEventListener("click", () => {
				document.body.append(overlay.overlay);
				setBigTable(overlay.overlay.querySelector(".table"), overlay.overlay.querySelector(".modal"));
			});
			tdEmployees.append(employeeBtn);
		} else tdEmployees.append("-");
		deleteProject.setAttribute("data-id", id);
		deleteProject.addEventListener("click", (e) => {
			document.body.append(createConfirm(`Are you sure you want to delete ${project} project?`));
			if (document.body.querySelector(".confirm")) {
				document.body.querySelector(".confirm").addEventListener("click", () => {
					const projectId = e.target.getAttribute("data-id");
					if (projects[key].id === projectId) {
						projects[key] = "";
						monthlyData[`${year}-${month}`].projects = projects.filter((project) => project !== "");
						employees.forEach((employee, index) => {
							employee.assignments.forEach((assign, ind) => {
								if (assign && Object.values(assign).includes(projectId)) {
									delete employee.assignments[ind];
									employees[index].assignments = employee.assignments.filter((assign) => assign.projectId !== projectId);
								}
							});
						});
						localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
						getContent(0);
						document.body.removeChild(document.querySelector(".overlay"));
					}
				});
				document.body.querySelector(".cancel").addEventListener("click", () => {
					document.body.removeChild(document.querySelector(".overlay"));
				});
			}
		});
		tdActions.append(deleteProject);
		tr.append(tdCompany, tdProject, tdBudget, tdCapacity, tdEmployees, tdIncome, tdActions);
		trTds.push(tr);
	}
	else {
		const trNoData = noData(7);
		trTds.push(trNoData);
	}
	return isDrawTable ? trTds : totalIncome;
}
//#endregion
//#region src/js/modules/availability.js
function makeAvailability(details) {
	const availability = createMyElement("div", "availability-content");
	const table = createMyElement("table", "table calendar");
	const trTh = createMyElement("tr");
	const workDays = createMyElement("div", "work");
	const vacationDays = createMyElement("div", "vacation");
	const setVacation = createMyElement("button", "btn set-vacation", "Set vacation");
	const today = (/* @__PURE__ */ new Date()).getDate();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const month = (/* @__PURE__ */ new Date()).getMonth();
	const currentMonthDays = new Date(details.year, Number(details.month) + 1, 0).getDate();
	const firstDayName = new Date(details.year, details.month, 1).toLocaleString("en", { weekday: "short" });
	let startCalendarDay = 0;
	weekDaysName.forEach((day, ind) => {
		trTh.append(createMyElement("th", "", day));
		if (firstDayName === day) startCalendarDay = ind;
	});
	table.append(trTh);
	const tdMonthDays = Array.from({ length: 42 }, (_, ind) => {
		if (startCalendarDay !== 0 && ind < startCalendarDay || ind > currentMonthDays + startCalendarDay - 1) return createMyElement("td", "", "");
		else {
			const dayNumber = ind - startCalendarDay + 1;
			const day = createMyElement("td", "", dayNumber);
			if (details.vacation && details.vacation.length > 0 && details.vacation.includes(dayNumber)) day.classList.add("vacation");
			return day;
		}
	});
	let tr = createMyElement("tr", "week");
	if (startCalendarDay !== 0) {
		const emptyTd = createMyElement("td", "empty-cell");
		emptyTd.colSpan = startCalendarDay;
		tr.append(emptyTd);
	}
	tdMonthDays.forEach((day, ind) => {
		if (Number(day.textContent) === today && Number(details.year) === year && Number(details.month) === month) day.classList.add("today");
		if (ind % 7 === 0 && ind !== 0) {
			tr = createMyElement("tr", "week");
			tr.append(day);
		} else if (day.textContent !== "") tr.append(day);
		table.append(tr);
	});
	vacationDays.append(workDays, setVacation);
	availability.append(table, workDays, vacationDays);
	const overlay = createModal({
		title: `${details.name} - Availability`,
		content: availability,
		text: `${months[details.month]} ${details.year}`,
		item: "availability"
	});
	document.body.append(overlay);
	const weeks = [...document.querySelectorAll(".week")];
	weeks.forEach((week, ind) => {
		const sunday = [...week.childNodes][0];
		const saturday = [...week.childNodes][week.childNodes.length - 1];
		if (!sunday.classList.contains("empty-cell")) sunday.classList.add("day-off");
		if (week.childNodes.length === 7 || ind === 0) saturday.classList.add("day-off");
	});
	const [emptyWeek] = weeks.filter((week) => [...week.childNodes].every((day) => day.textContent === ""));
	if (emptyWeek) table.removeChild(emptyWeek);
	overlay.addEventListener("click", (e) => {
		if (e.target.classList.contains("overlay") || e.target.classList.contains("modal-close")) {
			const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
			monthlyData[`${details.year}-${details.month}`].employees.forEach((employee) => {
				if (employee.id === details.id) {
					const writtenVacationData = [...employee.vacationDays].sort((a, b) => a - b);
					const newVacationData = [...details.vacation].sort((a, b) => a - b);
					if (!(writtenVacationData.length === newVacationData.length && writtenVacationData.every((value, index) => value === newVacationData[index]))) {
						document.body.append(createConfirm("Vacation days have been changed. Apply the changes?"));
						if (document.body.querySelector(".confirm")) {
							document.body.querySelector(".confirm").addEventListener("click", () => {
								employee.vacationDays = details.vacation.filter((f) => f !== "");
								localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
								getContent(1);
								[...document.querySelectorAll(".overlay")].forEach((element) => document.body.removeChild(element));
							});
							document.body.querySelector(".cancel").addEventListener("click", () => {
								getContent(1);
								document.body.removeChild(document.querySelector(".overlay"));
							});
						}
					}
				}
			});
		}
	});
	function workDaysBlock(workDaysCount) {
		const pElement = createMyElement("p", "", `Working Days: ${workDaysCount} / ${getWorkDaysInMonth(details.year, details.month)} days`);
		clearDOM(workDays);
		workDays.append(pElement);
	}
	let vacation = details.vacation ? details.vacation : [];
	let workDaysCount = getWorkDaysInMonth(details.year, details.month) - vacation.length;
	tdMonthDays.filter((day) => day.textContent !== "" && !day.classList.contains("day-off")).map((day) => day.addEventListener("click", (e) => {
		const vacaitionDayNumber = Number(e.target.textContent);
		if (!vacation.includes(vacaitionDayNumber)) {
			e.target.classList.add("vacation");
			vacation.push(vacaitionDayNumber);
			const filteredVacationData = vacation.filter((f) => f !== "");
			workDaysCount = getWorkDaysInMonth(details.year, details.month) - filteredVacationData.length;
			workDaysBlock(workDaysCount);
		} else {
			const dayIndex = vacation.indexOf(vacaitionDayNumber);
			vacation[dayIndex] = "";
			e.target.classList.remove("vacation");
			workDaysCount += 1;
			workDaysBlock(workDaysCount);
		}
	}));
	workDaysBlock(workDaysCount);
	setVacation.addEventListener("click", () => {
		details.monthlyData[`${details.year}-${details.month}`].employees.forEach((employee) => {
			if (employee.id === details.id) {
				employee.vacationDays = vacation.filter((f) => f !== "");
				localStorage.setItem("monthlyData", JSON.stringify(details.monthlyData));
				document.body.removeChild(document.querySelector(".overlay"));
				getContent(1);
			}
		});
	});
}
//#endregion
//#region src/js/modules/employees.js
function employeeTable(year, month, monthlyData, employees, projects) {
	const trs = [];
	if (employees && employees.length !== 0) for (let key in employees) {
		const { id, name, surname, dob, position, salary, assignments, vacationDays } = employees[key];
		const age = getAge(dob);
		const currentCapacityEmployee = getEmployeeCurrentCapacity(assignments);
		const maxCapacity = 1.5;
		const payment = getNumber(salary * Math.max(.5, currentCapacityEmployee));
		const assignmentCount = assignments.length;
		const tr = createMyElement("tr");
		const tdName = createMyElement("td", "", name);
		const tdSurname = createMyElement("td", "", surname);
		const tdAge = createMyElement("td", "", age);
		const tdPosition = createMyElement("td", `position editable`, position);
		tdPosition.setAttribute("data-id", id);
		const tdSalary = createMyElement("td", "salary editable", `$${salary}`);
		tdSalary.setAttribute("data-id", id);
		const tdPayment = createMyElement("td", "", `$${payment}`);
		const tdAssignments = createMyElement("td", "project");
		let showAssignments = "-";
		const overlayAssignments = getDetailsTable({
			modalTitle: `Assignments for ${name} ${surname}`,
			thTitle: "Project",
			assign: assignments,
			projects,
			employees,
			year,
			month
		});
		if (assignmentCount > 0) {
			showAssignments = createMyElement("button", "btn assignments", "Show");
			const assignmentDetails = `Assignments ${assignmentCount} and employee capacity ${currentCapacityEmployee} / ${maxCapacity}`;
			showAssignments.addEventListener("click", () => {
				document.body.append(overlayAssignments.overlay);
				setBigTable(overlayAssignments.overlay.querySelector(".table"), overlayAssignments.overlay.querySelector(".modal"));
			});
			showAssignments.addEventListener("mouseover", (e) => createTooltip({
				targetElement: e.target,
				tooltipClass: "tooltip",
				tooltipStringContent: assignmentDetails,
				tooltipHtmlContent: "",
				position: "center"
			}));
			showAssignments.addEventListener("mouseout", removeTooltip);
		}
		let projectedIncome = 0;
		projectedIncome += overlayAssignments.profit;
		const tdIncome = createMyElement("td", `${projectedIncome >= 0 ? "profit" : "loss"}`, `$${projectedIncome.toFixed(2)}`);
		const tdActions = createMyElement("td", "actions");
		const availability = createMyElement("button", "btn availability", "Availability");
		const assign = createMyElement("button", `btn assign`, "Assign");
		if (currentCapacityEmployee === maxCapacity) {
			assign.disabled = true;
			assign.classList.add("disable");
		}
		const deleteEmployee = createMyElement("button", "btn delete", "Delete");
		deleteEmployee.setAttribute("data-id", id);
		deleteEmployee.addEventListener("click", (e) => {
			document.body.append(createConfirm(`Are you sure you want to delete ${name} ${surname} employee?`));
			if (document.body.querySelector(".confirm")) {
				document.body.querySelector(".confirm").addEventListener("click", () => {
					const employeeId = e.target.getAttribute("data-id");
					if (employees[key].id === employeeId) {
						employees[key] = "";
						monthlyData[`${year}-${month}`].employees = employees.filter((employee) => employee !== "");
						localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
						getContent(1);
						document.body.removeChild(document.querySelector(".overlay"));
					}
				});
				document.body.querySelector(".cancel").addEventListener("click", () => {
					document.body.removeChild(document.querySelector(".overlay"));
				});
			}
		});
		const aboutPopup = {
			fullName: `${name} ${surname}`,
			currentCapacityEmployee,
			maxCapacity,
			assignments: assignments.map((a) => a.projectId),
			projects,
			employees,
			monthlyData,
			year,
			month,
			id
		};
		assign.addEventListener("click", () => {
			if (document.querySelector(".popup")) {
				document.body.removeChild(document.querySelector(".popup"));
				makeAssign(assign.getBoundingClientRect(), aboutPopup);
			} else makeAssign(assign.getBoundingClientRect(), aboutPopup);
		});
		availability.addEventListener("click", (e) => makeAvailability({
			name: `${name} ${surname}`,
			year,
			month,
			monthlyData,
			vacation: vacationDays,
			id
		}));
		tdAssignments.append(showAssignments);
		tdActions.append(availability, assign, deleteEmployee);
		tr.append(tdName, tdSurname, tdAge, tdPosition, tdSalary, tdPayment, tdAssignments, tdIncome, tdActions);
		trs.push(tr);
	}
	else {
		const trNoData = noData(9);
		trs.push(trNoData);
	}
	return trs;
}
//#endregion
//#region src/js/common/functions.js
var getNumber = (n) => +Number(n).toFixed(2);
var closePopup = () => document.body.removeChild(document.querySelector(".popup"));
var getAllAssignments = (employees) => employees.filter((employee) => employee.assignments.length !== 0).flatMap((employee) => employee.assignments);
var onDisableButton = (btn) => {
	btn.classList.add("disable");
	btn.disabled = true;
	return btn;
};
var onActiveButton = (btn) => {
	btn.classList.remove("disable");
	btn.disabled = false;
	return btn;
};
var getEmployeeCurrentCapacity = (assignments) => assignments.length !== 0 ? getNumber(assignments.reduce((acc, assignEmpl) => acc += getNumber(assignEmpl.capacity), 0)) : 0;
function getCurrentPeriod() {
	const month = document.querySelector(".months").value;
	const year = document.querySelector(".years").value;
	return {
		month,
		year,
		period: `${months[month]} ${year}`
	};
}
function clearDOM(parent) {
	while (parent.firstChild) parent.removeChild(parent.firstChild);
}
function createMyElement(element, classElement = "", textElement = "") {
	const myElement = document.createElement(element);
	if (textElement) myElement.textContent = textElement;
	if (classElement) myElement.className = classElement;
	return myElement;
}
function createModal(aboutModal) {
	const overlay = createMyElement("div", "overlay");
	const modal = createMyElement("div", `modal ${aboutModal.item}`);
	const modalTitle = createMyElement("h2", "modal-title", aboutModal.title);
	const modalClose = createMyElement("button", "btn modal-close", "X");
	const modalContent = createMyElement("div", "modal-content");
	if (aboutModal.text) {
		const modalText = createMyElement("p", "modal-text", aboutModal.text);
		modalContent.append(modalText);
	}
	modalContent.append(aboutModal.content);
	modal.append(modalClose, modalTitle, modalContent);
	overlay.append(modal);
	overlay.addEventListener("click", (e) => {
		if (e.target.classList.contains("overlay") || e.target.classList.contains("modal-close")) document.body.removeChild(overlay);
	});
	return overlay;
}
function noData(spans, msg = "") {
	const tr = createMyElement("tr");
	const td = createMyElement("td", "no-data", msg !== "" ? msg : "No data.");
	td.colSpan = spans;
	tr.append(td);
	return tr;
}
function createConfirm(text) {
	const yes = createMyElement("button", "btn confirm", "Yes");
	const no = createMyElement("button", "btn cancel", "No");
	const content = createMyElement("div", "confirm-content");
	content.append(yes, no);
	return createModal({
		title: "Confirm",
		text,
		content,
		item: "confirm-modal"
	});
}
function createPopup(aboutPopup) {
	const popup = createMyElement("div", "popup");
	const title = createMyElement("h3", "popup-title", aboutPopup.title);
	const text = createMyElement("p", "popup-text-block", aboutPopup.text);
	if (aboutPopup.subtext) {
		const subtext = createMyElement("span", "popup-subtext", aboutPopup.subtext);
		text.append(subtext);
	}
	popup.append(title, text, aboutPopup.content);
	return popup;
}
function getEmployeeAssignmentsCountCapacity(employees) {
	const counts = {};
	getAllAssignments(employees).forEach((assign) => assign ? counts[assign.projectId] = (counts[assign.projectId] || 0) + getNumber(assign.capacity) * getNumber(assign.fit) : 0);
	return counts;
}
function getWorkDaysInMonth(year, month) {
	let workDays = 0;
	let daysInMonth = new Date(Number(year), Number(month) + 1, 0).getDate();
	for (let i = 1; i <= daysInMonth; i += 1) {
		let dayOfWeek = new Date(year, month, i).getDay();
		if (dayOfWeek !== 0 && dayOfWeek !== 6) workDays += 1;
	}
	return workDays;
}
function setPopupPosition(popup, popupPosition) {
	const popupHeight = popup.offsetHeight;
	const viewportHeight = window.innerHeight;
	if (popupPosition.bottom > viewportHeight - popupHeight) popup.style.bottom = "20px";
	else popup.style.top = `${popupPosition.top + popupPosition.height + 10}px`;
}
function createRange(aboutRange) {
	const range = createMyElement("input", "range");
	range.type = "range";
	range.min = .1;
	range.max = aboutRange.maxValue;
	range.step = .1;
	range.value = aboutRange.value;
	return range;
}
function createLabel(aboutLabel) {
	const label = createMyElement("label", "label", `${aboutLabel.labelTitle}`);
	const labelValue = createMyElement("span", `value ${aboutLabel.class}`, `${aboutLabel.value}`);
	const hint = createMyElement("span", "hint", `${aboutLabel.hintText}`);
	label.append(labelValue, aboutLabel.range, hint);
	return label;
}
function setBigTable(table, modal) {
	const rect = table.getBoundingClientRect();
	if (rect.height + rect.x > window.innerHeight) modal.classList.add("big-table");
	console.log(rect);
	console.log(window.innerHeight, rect.height + rect.x);
}
function createTooltip(aboutTooltip) {
	const { targetElement, tooltipClass, tooltipStringContent, tooltipHtmlContent, position } = aboutTooltip;
	const rect = targetElement.getBoundingClientRect();
	const tooltip = createMyElement("div");
	if (tooltipClass !== "") tooltip.classList.add(tooltipClass);
	if (tooltipStringContent !== "") tooltip.textContent = tooltipStringContent;
	if (tooltipHtmlContent !== "") tooltip.append(tooltipHtmlContent);
	document.body.append(tooltip);
	const leftPosition = position === "start" ? 0 : tooltip.offsetWidth / 2;
	tooltip.style.position = "absolute";
	tooltip.style.top = `${window.scrollY + rect.top + rect.height + 10}px`;
	tooltip.style.left = `${rect.left - leftPosition + rect.width / 2}px`;
}
var removeTooltip = (event, tooltipClass = "tooltip") => document.body.removeChild(document.querySelector(`.${tooltipClass}`));
function cancelEdit(selector) {
	if (document.querySelector(selector)) {
		const parent = document.querySelector(selector).parentNode;
		parent.removeChild(document.querySelector(selector));
		parent.classList.add("editable");
	}
}
function drawContentTable(details) {
	const { isDrawTable, employees, projects, table, trThs, pageId, year, month, monthlyData } = details;
	const trTds = pageId === 0 ? projectTable(year, month, isDrawTable, monthlyData, employees, projects) : employeeTable(year, month, monthlyData, employees, projects);
	clearDOM(table);
	table.append(trThs);
	trTds.forEach((tr) => table.append(tr));
	return table;
}
var filterData = (filterData, filterChip, filterValue) => filterData.filter((data) => data[filterChip].toLowerCase().includes(filterValue.toLowerCase()));
function getAge(date) {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
	const currentDay = (/* @__PURE__ */ new Date()).getDate();
	const [year, month, day] = date.split("-").map((n) => Number(n));
	let age = currentYear - year;
	if (currentMonth < month - 1) age -= 1;
	else if (currentMonth === month - 1) {
		if (currentDay < day) age -= 1;
	}
	return age;
}
//#endregion
//#region src/js/modules/assignments.js
function makeAssign(popupPosition, aboutPopup) {
	const assignPopupContent = createMyElement("div", "popup-content");
	const label = createMyElement("label", "assign-label", "Select Project:");
	const select = createMyElement("select", "assign-select");
	select.name = "projects";
	const assignBtn = createMyElement("button", "btn assign-btn disable", "Assign");
	assignBtn.disabled = true;
	const assignCnl = createMyElement("button", "btn assign-cnl", "Cancel");
	const btnBlock = createMyElement("div", "assign-btn-block");
	assignCnl.addEventListener("click", closePopup);
	const defaultOption = createMyElement("option", "", "Select a project");
	defaultOption.value = "";
	defaultOption.selected = true;
	select.append(defaultOption);
	const validateRangeCapacity = createMyElement("p", "validate-range-capacity");
	let capacityValue = 0;
	let fitValue = 0;
	let selectedProject = "";
	const projectData = [];
	for (let key in aboutPopup.projects) {
		const currentCapacityProject = getEmployeeAssignmentsCountCapacity(aboutPopup.employees)[aboutPopup.projects[key].id] ? getEmployeeAssignmentsCountCapacity(aboutPopup.employees)[aboutPopup.projects[key].id] : 0;
		projectData.push({
			id: aboutPopup.projects[key].id,
			capacity: aboutPopup.projects[key].capacity,
			currentCapacityProject,
			available: aboutPopup.projects[key].capacity - currentCapacityProject
		});
		const option = createMyElement("option", "", `${aboutPopup.projects[key].project} 
      (${getNumber(aboutPopup.projects[key].capacity - currentCapacityProject)} / ${aboutPopup.projects[key].capacity})`);
		option.value = key;
		select.append(option);
	}
	const rangeBlock = createMyElement("div");
	select.addEventListener("change", (e) => {
		selectedProject = e.target.value;
		if (selectedProject && projectData[selectedProject].available > 0 && !aboutPopup.assignments.includes(projectData[selectedProject].id)) {
			clearDOM(rangeBlock);
			const currentCapacityProject = getNumber(projectData[selectedProject].currentCapacityProject);
			validateRangeCapacity.textContent = "";
			const capacityRange = createRange({
				maxValue: 1.5,
				value: aboutPopup.currentCapacityEmployee !== 0 ? aboutPopup.maxCapacity - aboutPopup.currentCapacityEmployee : 1
			});
			const capacityRangeLabel = createLabel({
				labelTitle: "Capacity Allocation: ",
				value: capacityRange.value,
				hintText: "Adjust capacity (0.0 - 1.5)",
				range: capacityRange,
				class: "capacity-range-label-value"
			});
			const fitRange = createRange({
				maxValue: 1,
				value: 1
			});
			const fitRangeLabel = createLabel({
				labelTitle: "Project Fit: ",
				value: fitRange.value,
				hintText: "Project fit coefficient (0.0 - 1.0)",
				range: fitRange,
				class: "fit-range-label-value"
			});
			const projectInfo = createMyElement("div", "project-info");
			const projectCapacity = createMyElement("div", "info-row", "Project Capacity:");
			const capacityDefault = projectData[selectedProject].capacity;
			const projectCapacityValue = createMyElement("span", "info-value", `${currentCapacityProject} / ${capacityDefault}`);
			projectCapacity.append(projectCapacityValue);
			const efectiveCapacity = getNumber(capacityRange.value * fitRange.value);
			const efectiveCapacityElement = createMyElement("div", "info-row", "Effective Capacity:");
			const efectiveCapacityValue = createMyElement("span", "info-value", efectiveCapacity);
			efectiveCapacityElement.append(efectiveCapacityValue);
			const afterAssignment = createMyElement("div", "info-row", "After Assignment:");
			const wrapperElement = createMyElement("span", "info-value");
			const afterAssignmentValue = createMyElement("span", "", `${getNumber(efectiveCapacity + currentCapacityProject)}`);
			const afterAssignmentCapacityValue = createMyElement("span", "", ` / ${capacityDefault}`);
			wrapperElement.append(afterAssignmentValue, afterAssignmentCapacityValue);
			afterAssignment.append(wrapperElement);
			projectInfo.append(projectCapacity, efectiveCapacityElement, afterAssignment);
			function validate(isValid, msg = "") {
				if (isValid) {
					capacityValue = capacityRange.value;
					fitValue = fitRange.value;
					assignBtn.disabled = false;
					assignBtn.classList.remove("disable");
					if (msg === "" && rangeBlock.contains(validateRangeCapacity)) rangeBlock.removeChild(validateRangeCapacity);
				} else {
					assignBtn.disabled = true;
					assignBtn.classList.add("disable");
					validateRangeCapacity.textContent = msg;
					if (msg !== "") rangeBlock.append(validateRangeCapacity);
				}
			}
			if (capacityDefault < efectiveCapacity + currentCapacityProject) validate(false, `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${getNumber(efectiveCapacity + currentCapacityProject)})`);
			else validate(true);
			rangeBlock.append(capacityRangeLabel, fitRangeLabel, projectInfo);
			if (validateRangeCapacity.textContent !== "") rangeBlock.append(validateRangeCapacity);
			const capacityRangeLabelValue = document.querySelector(".capacity-range-label-value");
			const fitRangeLabelValue = document.querySelector(".fit-range-label-value");
			capacityRange.addEventListener("input", (event) => {
				const targetValue = getNumber(event.target.value);
				capacityRangeLabelValue.textContent = targetValue;
				efectiveCapacityValue.textContent = getNumber(targetValue * getNumber(fitRangeLabelValue.textContent));
				const allCapacity = getNumber(getNumber(efectiveCapacityValue.textContent) + currentCapacityProject);
				afterAssignmentValue.textContent = allCapacity;
				if (targetValue === 0 || getNumber(fitRangeLabelValue.textContent) === 0) validate(false, "Please enter a valid range");
				else if (aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent) > aboutPopup.maxCapacity) validate(false, `Employee capacity would exceed ${aboutPopup.maxCapacity} (current: ${aboutPopup.currentCapacityEmployee}, target: ${getNumber(aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent))})`);
				else if (capacityDefault < allCapacity) validate(false, `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${allCapacity})`);
				else validate(true);
			});
			fitRange.addEventListener("input", (event) => {
				if (getNumber(capacityRangeLabelValue.textContent) !== 0) {
					const targetValue = getNumber(event.target.value);
					fitRangeLabelValue.textContent = targetValue;
					efectiveCapacityValue.textContent = getNumber(targetValue * getNumber(capacityRangeLabelValue.textContent));
					const allCapacity = getNumber(getNumber(efectiveCapacityValue.textContent) + currentCapacityProject);
					afterAssignmentValue.textContent = allCapacity;
					if (targetValue === 0 || getNumber(capacityRangeLabelValue.textContent) === 0) validate(false, "Please enter a valid range");
					else if (aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent) > aboutPopup.maxCapacity) validate(false, `Employee capacity would exceed ${aboutPopup.maxCapacity} (current: ${aboutPopup.currentCapacityEmployee}, target: ${getNumber(aboutPopup.currentCapacityEmployee + getNumber(capacityRangeLabelValue.textContent))})`);
					else if (capacityDefault < allCapacity) validate(false, `Project effective capacity would exceed ${capacityDefault} (current: ${currentCapacityProject}, target: ${allCapacity})`);
					else validate(true);
				}
			});
			if (window.innerHeight < parseInt(popup.style.top) + popup.offsetHeight) {
				popup.style.bottom = "20px";
				popup.style.top = "auto";
			}
		} else {
			clearDOM(rangeBlock);
			assignBtn.disabled = true;
			assignBtn.classList.add("disable");
			if (!selectedProject) validateRangeCapacity.textContent = "Select a project, please!";
			if (selectedProject && aboutPopup.assignments.includes(projectData[selectedProject].id)) validateRangeCapacity.textContent = "Employee has been allready assigned to project";
			if (selectedProject && projectData[selectedProject].available <= 0) validateRangeCapacity.textContent = "Available capacity project equal 0";
			if (validateRangeCapacity.textContent !== "") rangeBlock.append(validateRangeCapacity);
		}
	});
	assignBtn.addEventListener("click", () => {
		aboutPopup.monthlyData[`${aboutPopup.year}-${aboutPopup.month}`].employees.forEach((employee) => {
			if (employee.id === aboutPopup.id) {
				employee.assignments.push({
					projectId: projectData[selectedProject].id,
					employeeId: aboutPopup.id,
					capacity: capacityValue,
					fit: fitValue
				});
				localStorage.setItem("monthlyData", JSON.stringify(aboutPopup.monthlyData));
				if (document.querySelector(".popup")) document.body.removeChild(document.querySelector(".popup"));
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
//#endregion
//#region src/js/modules/burger.js
var burger = document.querySelector(".burger");
var nav = document.querySelector(".navigation");
burger.addEventListener("click", () => {
	document.querySelector(".main").removeAttribute("style");
	nav.classList.toggle("hide");
	if (nav.classList.contains("hide")) {
		document.querySelector(".header").style.paddingLeft = "80px";
		document.querySelector(".main").classList.add("main-full-width");
	} else {
		document.querySelector(".header").removeAttribute("style");
		document.querySelector(".main").classList.remove("main-full-width");
	}
});
window.addEventListener("resize", () => {
	document.querySelector(".main").style.transition = "0s";
	if (!nav.classList.contains("hide")) {
		if (document.body.clientWidth < 810) {
			nav.classList.add("hide");
			document.querySelector(".header").style.paddingLeft = "80px";
			document.querySelector(".main").classList.remove("main-full-width");
		}
	} else document.querySelector(".main").classList.add("main-full-width");
});
//#endregion
//#region src/js/modules/form.js
function isValid() {
	const [addButton, ...other] = arguments;
	if (other.every((value) => value === true)) {
		addButton.disabled = false;
		addButton.classList.remove("disable");
	} else {
		addButton.disabled = true;
		addButton.classList.add("disable");
	}
}
function closeAside(aside, form) {
	aside.classList.remove("show");
	getValues(form).button.disabled = true;
	getValues(form).button.classList.add("disable");
	getValues(form).inputs.map((input) => {
		input.value = "";
		input.classList.remove("valid");
		input.classList.remove("invalid");
		if (input.nextElementSibling) input.nextElementSibling.remove();
	});
	clearDOM(aside);
}
function getValues(form) {
	const getAllInput = [...form.getElementsByTagName("input"), ...form.getElementsByTagName("select")];
	const addButton = form.querySelector(".addButton");
	const assignments = [];
	const vacationDays = [];
	const id = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
	const allValuesInput = getAllInput.map((input) => input.value.trim());
	return {
		allValue: form.getElementsByTagName("select").length !== 0 ? [
			...allValuesInput,
			id,
			assignments,
			vacationDays
		] : [...allValuesInput, id],
		allTitle: getAllInput.map((input) => input.title),
		inputs: getAllInput.map((input) => input),
		button: addButton
	};
}
function setInvalid(element, title) {
	if (!element.nextElementSibling) {
		const error = createMyElement("span", "error-message", title);
		element.classList.remove("valid");
		element.classList.add("invalid");
		element.after(error);
	}
	return false;
}
function setValid(element) {
	element.classList.remove("invalid");
	element.classList.add("valid");
	if (element.nextElementSibling) element.nextElementSibling.remove();
	return true;
}
function birthdayValid(birthdayValue) {
	let result = false;
	if (birthdayValue && `${new Date(birthdayValue).getFullYear()}`.length === 4) {
		if ((/* @__PURE__ */ new Date()).getFullYear() - new Date(birthdayValue).getFullYear() === 18) if ((/* @__PURE__ */ new Date()).getMonth() === new Date(birthdayValue).getMonth()) if ((/* @__PURE__ */ new Date()).getDate() >= new Date(birthdayValue).getDate()) result = true;
		else result = false;
		else if ((/* @__PURE__ */ new Date()).getMonth() > new Date(birthdayValue).getMonth()) result = true;
		else result = false;
		else if ((/* @__PURE__ */ new Date()).getFullYear() - new Date(birthdayValue).getFullYear() > 18) result = true;
	}
	return result;
}
function validateProjectForm(form) {
	const [projectName, companyName, budget, employeeCapacity] = form.inputs;
	const [projectNameValue, companyNameValue, budgetValue, employeeCapacityValue] = form.allValue;
	const [projectNameTitle, companyNameTitle, budgetTitle, employeeCapacityTitle] = form.allTitle;
	const isValidProjectName = projectNameValue.length < 3 || !projectName.checkValidity() ? setInvalid(projectName, projectNameTitle) : setValid(projectName);
	const isValidCompanyName = companyNameValue.length < 2 || !companyName.checkValidity() ? setInvalid(companyName, companyNameTitle) : setValid(companyName);
	const isValidBudget = budgetValue <= 0 && typeof budgetValue !== "number" ? setInvalid(budget, budgetTitle) : setValid(budget);
	const isValidEmployeeCapacity = employeeCapacityValue < 1 && typeof employeeCapacityValue !== "number" ? setInvalid(employeeCapacity, employeeCapacityTitle) : setValid(employeeCapacity);
	isValid(form.button, isValidProjectName, isValidCompanyName, isValidBudget, isValidEmployeeCapacity);
}
function validateEmployeeForm(form) {
	const [employeeName, employeeSurname, birthday, salary, position] = form.inputs;
	const [employeeNameValue, employeeSurnameValue, birthdayValue, salaryValue, positionValue] = form.allValue;
	const [employeeNameTitle, employeeSurnameTitle, birthdayTitle, salaryTitle, positionTitle] = form.allTitle;
	const isValidEmployeeName = employeeNameValue.length < 3 || !employeeName.checkValidity() ? setInvalid(employeeName, employeeNameTitle) : setValid(employeeName);
	const isValidEmployeeSurname = employeeSurnameValue.length < 3 || !employeeSurname.checkValidity() ? setInvalid(employeeSurname, employeeSurnameTitle) : setValid(employeeSurname);
	const isValidBirthday = !birthdayValid(birthdayValue) ? setInvalid(birthday, birthdayTitle) : setValid(birthday);
	const isValidSalary = salaryValue <= 0 && typeof salaryValue !== "number" ? setInvalid(salary, salaryTitle) : setValid(salary);
	const isValidPosition = positionValue === "" ? setInvalid(position, positionTitle) : setValid(position);
	isValid(form.button, isValidEmployeeName, isValidEmployeeSurname, isValidBirthday, isValidSalary, isValidPosition);
}
function createForm(aboutForm, classForm, asidePanelElement) {
	const form = createMyElement("form", `form ${classForm}`);
	const btnBlock = createMyElement("div", "buttons");
	for (let key in aboutForm) {
		const { label, input, type, name, title, required, ...other } = aboutForm[key];
		if (key !== "position" && key !== "addButton" && key !== "canselButton") {
			input.type = type;
			input.name = name;
			input.title = title;
			input.required = required;
			if (other.minlength) {
				input.minLength = other.minlength;
				input.pattern = other.pattern;
			} else {
				input.min = other.min;
				input.step = other.step;
			}
			label.append(input);
			form.append(label);
		} else if (key === "position") {
			const { label, input, name, title, required, options: { defaultOption, junior, middle, senior, lead, architect, BO } } = aboutForm[key];
			input.name = name;
			input.title = title;
			input.required = required;
			defaultOption.selected = true;
			defaultOption.value = "";
			junior.value = "Junior";
			middle.value = "Middle";
			senior.value = "Senior";
			lead.value = "Lead";
			architect.value = "Architect";
			BO.value = "BO";
			input.append(junior, middle, senior, lead, architect, BO);
			input.prepend(defaultOption);
			label.append(input);
			form.append(label);
		} else {
			const { button, type, disabled } = aboutForm[key];
			button.type = type;
			button.disabled = disabled;
			btnBlock.append(button);
		}
	}
	form.append(btnBlock);
	form.addEventListener("input", () => {
		const allValuesFormForValidate = getValues(form);
		form.classList[1] === "project-form" ? validateProjectForm(allValuesFormForValidate) : validateEmployeeForm(allValuesFormForValidate);
	});
	form.addEventListener("click", (e) => {
		const allValues = getValues(form).allValue;
		if (e.target.type === "submit") form.addEventListener("submit", (event) => {
			event.preventDefault();
			const month = getCurrentPeriod().month;
			const year = getCurrentPeriod().year;
			const valuesFromForm = form.classList[1];
			const dataProject = {};
			const dataEmployee = {};
			if (localStorage.getItem("monthlyData")) {
				const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
				if (valuesFromForm === "project-form") {
					const [project, company, budget, capacity, id] = allValues;
					dataProject.id = id;
					dataProject.project = project;
					dataProject.company = company;
					dataProject.budget = budget;
					dataProject.capacity = capacity;
					if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
						monthlyData[`${year}-${month}`].projects.push(dataProject);
						localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
						getContent(0);
					}
				} else {
					const [name, surname, dob, salary, position, id, assignments, vacationDays] = allValues;
					dataEmployee.id = id;
					dataEmployee.name = name;
					dataEmployee.surname = surname;
					dataEmployee.dob = dob;
					dataEmployee.salary = salary;
					dataEmployee.position = position;
					dataEmployee.assignments = assignments;
					dataEmployee.vacationDays = vacationDays;
					if (monthlyData.hasOwnProperty(`${year}-${month}`)) {
						monthlyData[`${year}-${month}`].employees.push(dataEmployee);
						localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
						getContent(1);
					}
				}
				closeAside(asidePanelElement, form);
			}
		});
		if (e.target.type === "button") closeAside(asidePanelElement, form);
	});
	return form;
}
//#endregion
//#region src/js/modules/header.js
var asidePanel = document.querySelector(".aside-right");
function addButtons(button) {
	if (!asidePanel.hasChildNodes()) {
		asidePanel.classList.remove("no-smooth");
		asidePanel.classList.add("show");
		const formPanel = button === "addProject" ? formProject : formEmployee;
		const formClass = button === "addProject" ? "project-form" : "employee-form";
		const formTitle = button === "addProject" ? "Add New Project" : "Add New Employee";
		const panelContentProject = createForm(formPanel, formClass, asidePanel);
		const panelTitleProject = createMyElement("h2", "panel-title", formTitle);
		asidePanel.append(panelTitleProject, panelContentProject);
	}
}
function makeSeedData(period) {
	const seedTable = createMyElement("table", "table");
	const tr = createMyElement("tr");
	const trNoData = noData(6);
	const thYear = createMyElement("th", "", "Year");
	const thMonth = createMyElement("th", "", "Month");
	const thProjects = createMyElement("th", "", "Projects");
	const thEmployees = createMyElement("th", "", "Employees");
	const thTotalEstIncome = createMyElement("th", "", "Total Est. Income");
	const thAction = createMyElement("th", "", "Action");
	tr.append(thYear, thMonth, thProjects, thEmployees, thTotalEstIncome, thAction);
	seedTable.append(tr, trNoData);
	if (localStorage.getItem("monthlyData")) {
		const monthlyData = JSON.parse(localStorage.getItem("monthlyData"));
		const currentPeriod = `${period.year}-${period.month}`;
		for (let key in monthlyData) if (monthlyData[key].projects.length !== 0 || monthlyData[key].employees.length !== 0) {
			getContent(0, key);
			if (key !== currentPeriod) {
				if (seedTable.querySelector(".no-data")) seedTable.removeChild(trNoData);
				const [year, month] = key.split("-");
				const projectCount = String(monthlyData[key].projects.length);
				const employeeCount = String(monthlyData[key].employees.length);
				const total = estIncomePerMonth.getIncome(key);
				const incomeClass = total >= 0 ? "profit" : "loss";
				const tr = createMyElement("tr");
				const tdYear = createMyElement("td", "", year);
				const tdMonth = createMyElement("td", "", months[month]);
				const tdProject = createMyElement("td", "", projectCount);
				const tdEmployee = createMyElement("td", "", employeeCount);
				const tdTotal = createMyElement("td", `${incomeClass}`, `$${total.toFixed(2)}`);
				const tdAction = createMyElement("td");
				const seedButton = createMyElement("button", "btn seed", "Seed");
				seedButton.addEventListener("click", () => {
					document.body.append(createConfirm(`Copy data from ${months[month]} ${year} to ${period.period}?`));
					if (document.body.querySelector(".confirm")) {
						document.body.querySelector(".confirm").addEventListener("click", () => {
							monthlyData[`${period.year}-${period.month}`] = monthlyData[key];
							localStorage.setItem("monthlyData", JSON.stringify(monthlyData));
							const monthly = JSON.parse(localStorage.getItem("monthlyData"));
							for (let employee in monthly[`${period.year}-${period.month}`].employees) monthly[`${period.year}-${period.month}`].employees[employee].vacationDays = [];
							localStorage.setItem("monthlyData", JSON.stringify(monthly));
							getContent(0);
							[...document.querySelectorAll(".overlay")].forEach((element) => document.body.removeChild(element));
						});
						document.body.querySelector(".cancel").addEventListener("click", () => {
							document.body.removeChild(document.querySelectorAll(".overlay")[1]);
						});
					}
				});
				tdAction.append(seedButton);
				tr.append(tdYear, tdMonth, tdProject, tdEmployee, tdTotal, tdAction);
				seedTable.append(tr);
			}
		}
	}
	const modal = createModal({
		title: "Seed Data from Month",
		content: seedTable,
		text: `Select a month to copy its data to the current month (${period.period}):`,
		item: "seed-data"
	});
	document.body.append(modal);
	getContent(0);
}
function getHeader(page) {
	const header = document.querySelector(".header");
	clearDOM(header);
	const titleBlock = createMyElement("div");
	const btnBlock = createMyElement("div");
	const pageTitle = createMyElement("h1", "page-title", page.title);
	const period = createMyElement("p", "current-period", `period:  ${getCurrentPeriod().period}`);
	window.addEventListener("load", () => period.textContent = `period:  ${getCurrentPeriod().period}`);
	document.querySelector(".months").addEventListener("change", () => period.textContent = `period:  ${getCurrentPeriod().period}`);
	document.querySelector(".years").addEventListener("change", () => period.textContent = `period:  ${getCurrentPeriod().period}`);
	titleBlock.append(pageTitle, period);
	for (let key in page.buttons) {
		const btn = page.buttons[key]();
		btn.addEventListener("click", () => {
			if (key === "seedData") {
				makeSeedData(getCurrentPeriod());
				setBigTable(document.querySelector(".overlay .table"), document.querySelector(".overlay .modal"));
			} else addButtons(key);
		});
		btnBlock.append(btn);
	}
	header.append(titleBlock, btnBlock);
}
links.filter((link) => link.default ? getHeader(link) : "");
//#endregion
//#region src/js/modules/navigation.js
function addLinksToNav(linksList) {
	const links = document.querySelector(".links");
	linksList.forEach((link, index) => {
		const liElement = createMyElement("li", "link", link.title);
		liElement.setAttribute("data-id", index);
		if (link.default) liElement.classList.add("active");
		links.append(liElement);
	});
}
function switchPage(links$1) {
	const linkArr = [...links$1];
	linkArr.forEach((link) => {
		link.addEventListener("click", (e) => {
			linkArr.map((link) => link.classList.remove("active"));
			e.currentTarget.classList.add("active");
			const linkId = Number(e.currentTarget.getAttribute("data-id"));
			getHeader(links[linkId]);
			getContent(linkId);
			if (document.querySelector(".aside-right")) {
				const asidePanel = document.querySelector(".aside-right");
				asidePanel.classList.remove("show");
				clearDOM(asidePanel);
			}
		});
	});
}
addLinksToNav(links);
switchPage(document.querySelectorAll(".link"));
//#endregion
//#region src/js/modules/period.js
function addSelectMonthOptions(options) {
	const selectMonths = document.querySelector(".months");
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
	options.forEach((month, index) => {
		const monthOption = createMyElement("option", "", month);
		if (index === currentMonth) monthOption.selected = true;
		monthOption.value = index;
		selectMonths.append(monthOption);
	});
}
function addSelectYearOptions(options) {
	const selectYears = document.querySelector(".years");
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	options.forEach((year) => {
		const yearOption = createMyElement("option", "", year);
		if (year === currentYear) yearOption.selected = true;
		yearOption.value = year;
		selectYears.append(yearOption);
	});
}
addSelectMonthOptions(months);
addSelectYearOptions(years);
//#endregion

//# sourceMappingURL=main-D4ojvqbQ.js.map