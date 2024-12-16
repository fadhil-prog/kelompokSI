let borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];

function addItem(name, item, quantity, returnDate) {
    let borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];

    borrowedItems.push({
        name: name,
        item: item,
        quantity: quantity,
        returnDate: returnDate
    });

    localStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));
}

function removeItem(index) {
    borrowedItems.splice(index, 1);
    localStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));
}

function loadBorrowedList(elementId) {
    const borrowedList = document.getElementById(elementId);
    borrowedList.innerHTML = '';
    borrowedItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} meminjam ${item.item} hingga ${item.returnDate}
            <button onclick="removeItem(${index}); location.reload();" style="margin-left: 10px;">Hapus</button>
        `;
        borrowedList.appendChild(li);
    });
    if (borrowedItems.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Tidak ada peminjaman saat ini.";
        borrowedList.appendChild(li);
    }
}

function displayBorrowedItemsInTable() {
    const borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];
    const tableBody = document.querySelector('#borrowedTable tbody');
    
    tableBody.innerHTML = '';

    if (borrowedItems.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = "Tidak ada peminjaman saat ini.";
        cell.style.textAlign = "center";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    borrowedItems.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        const itemCell = document.createElement('td');
        itemCell.textContent = item.item;

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;

        const dateCell = document.createElement('td');
        dateCell.textContent = item.returnDate;

        row.appendChild(nameCell);
        row.appendChild(itemCell);
        row.appendChild(quantityCell);
        row.appendChild(dateCell);

        tableBody.appendChild(row);
    });
}

function populateBorrowersList() {
    const borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];
    const borrowerSelect = document.getElementById('borrower');

    borrowerSelect.innerHTML = '<option value="" disabled selected>Pilih nama peminjam</option>';

    borrowedItems.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index; 
        option.textContent = `${item.name} - ${item.item} (${item.quantity} pcs)`;
        borrowerSelect.appendChild(option);
    });

    if (borrowedItems.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.textContent = "Tidak ada peminjaman saat ini.";
        borrowerSelect.appendChild(option);
    }
}

document.getElementById('returnForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];
    const borrowerIndex = document.getElementById('borrower').value;
    const damaged = document.getElementById('damaged').value;

    if (borrowerIndex === "") {
        alert("Silakan pilih nama peminjam!");
        return;
    }

    const selectedItem = borrowedItems[borrowerIndex];
    const returnDate = new Date(); 
    const dueDate = new Date(selectedItem.returnDate); 

    const delayInDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    const lateFine = delayInDays > 0 ? delayInDays * 5000 : 0;
    const damageFine = damaged === "yes" ? 20000 * selectedItem.quantity : 0;
    const totalFine = lateFine + damageFine;

    borrowedItems.splice(borrowerIndex, 1);
    localStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));

    const fineInfo = {
        name: selectedItem.name,
        item: selectedItem.item,
        quantity: selectedItem.quantity,
        lateFine,
        damageFine,
        totalFine,
        delayInDays,
        returnDate: returnDate.toISOString().split('T')[0],
    };
    localStorage.setItem('fineInfo', JSON.stringify(fineInfo));
    window.location.href = "fine.html";
});
