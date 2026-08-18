document.addEventListener('DOMContentLoaded', () => {
    const tabs = [...document.querySelectorAll('.tab-button')];
    const panels = [...document.querySelectorAll('.content-panel')];
    const fileInputs = [...document.querySelectorAll('input[type="file"][data-upload-list]')];

    function activateTab(target, moveFocus = false) {
        tabs.forEach(tab => {
            const active = tab.dataset.target === target;
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            if (active && moveFocus) tab.focus();
        });

        panels.forEach(panel => {
            const active = panel.id === target;
            panel.classList.toggle('active', active);
            panel.hidden = !active;
        });

        history.replaceState(null, '', `#${target}`);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab.dataset.target));
        tab.addEventListener('keydown', event => {
            if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
            event.preventDefault();
            const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
            const next = tabs[(index + direction + tabs.length) % tabs.length];
            activateTab(next.dataset.target, true);
        });
    });

    document.querySelectorAll('[data-open-tab]').forEach(button => {
        button.addEventListener('click', () => {
            activateTab(button.dataset.openTab);
            document.querySelector('.workspace').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    if (location.hash && panels.some(panel => `#${panel.id}` === location.hash)) {
        activateTab(location.hash.slice(1));
    }

    fileInputs.forEach(fileInput => fileInput.addEventListener('change', () => {
        const uploadList = document.getElementById(fileInput.dataset.uploadList);
        uploadList.replaceChildren();
        const files = [...fileInput.files];
        uploadList.hidden = files.length === 0;

        files.forEach(file => {
            const row = document.createElement('div');
            row.className = 'file-item';
            const name = document.createElement('strong');
            name.textContent = file.name;
            const size = document.createElement('span');
            size.textContent = `${Math.max(1, Math.round(file.size / 1024))} KB`;
            row.append(name, size);
            uploadList.appendChild(row);
        });
    }));
});
