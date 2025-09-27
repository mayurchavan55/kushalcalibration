class SearchableDropdown {
	constructor(containerElement, options = []) {
		this.container = containerElement;
		this.input = document.createElement('input');
		this.list = document.createElement('div');

		this.input.setAttribute('type', 'text');
		this.input.setAttribute('placeholder', 'Search...');
		this.input.classList.add('form-control');
		this.list.classList.add('dropdown-list');

		this.container.classList.add('searchable-dropdown');
		this.container.appendChild(this.input);
		this.container.appendChild(this.list);

		this.options = options;
		this.filteredOptions = options;

		this.renderList();
		this.bindEvents();
	}

	renderList() {
		this.list.innerHTML = '';
		if (this.filteredOptions.length === 0) {
			this.list.innerHTML = '<div class="dropdown-item text-muted">No matches found</div>';
			this.list.style.display = 'block';
			return;
		}

		this.filteredOptions.forEach(opt => {
			const item = document.createElement('div');
			item.classList.add('dropdown-item');
			item.textContent = opt.label;
			item.dataset.value = opt.value;

			item.addEventListener('click', () => {
				this.input.value = opt.label;
				this.input.dataset.selectedValue = opt.value;
				this.list.style.display = 'none';
			});

			this.list.appendChild(item);
		});

		this.list.style.display = 'block';
	}

	bindEvents() {
		this.input.addEventListener('input', () => {
			const keyword = this.input.value.toLowerCase();
			this.filteredOptions = this.options.filter(opt =>
				opt.label.toLowerCase().includes(keyword)
			);
			this.renderList();
		});

		document.addEventListener('click', (e) => {
			if (!this.container.contains(e.target)) {
				this.list.style.display = 'none';
			}
		});
	}

	getSelectedValue() {
		return this.input.dataset.selectedValue || '';
	}
}
