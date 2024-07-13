const students = [
    { number: '1', prefix: 'เด็กชาย', name: 'สมชาย ใจดี', grade: 'A' },
    { number: '2', prefix: 'เด็กหญิง', name: 'สมหญิง รักเรียน', grade: 'B' },
    { number: '3', prefix: 'เด็กชาย', name: 'แสนดี มุ่งมั่น', grade: 'B' },
    { number: '4', prefix: 'เด็กชาย', name: 'ตั้งใจ ใฝ่เรียนรู้', grade: 'A' },
    { number: '5', prefix: 'เด็กหญิง', name: 'สมรศรี ศรีงาม ', grade: 'B' },
    { number: '6', prefix: 'เด็กชาย', name: 'ความฝัน แสนไกล', grade: 'C' },
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const dataPerPageSelect = document.getElementById('dataPerPage');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumbersContainer = document.getElementById('pageNumbers');
    let currentPage = 1;
    let studentsPerPage = parseInt(dataPerPageSelect.value);
    let currentDeleteId = null;

    function populateTable(data, page = 1, perPage = studentsPerPage) {
        studentTable.innerHTML = '';
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedStudents = data.slice(start, end);

        paginatedStudents.forEach(student => {
            const row = studentTable.insertRow();
            row.insertCell(0).textContent = student.number;
            row.insertCell(1).textContent = student.prefix;
            row.insertCell(2).textContent = student.name;
            row.insertCell(3).textContent = student.grade;
            const actionsCell = row.insertCell(4);
            actionsCell.classList.add('actions');
            actionsCell.innerHTML = `
                <i class="fa fa-edit edit-icon" data-id="${student.number}"></i>
                <i class="fa fa-trash delete-icon" data-id="${student.number}"></i>
            `;
        });
    }

    function updatePagination(data) {
        const totalPages = Math.ceil(data.length / studentsPerPage);
        pageNumbersContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.textContent = i;
            pageNumber.classList.add('page-number');
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                populateTable(data, currentPage);
                updatePagination(data);
            });
            pageNumbersContainer.appendChild(pageNumber);
        }

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const filteredStudents = students.filter(student =>
            student.number.includes(filter) ||
            student.name.toLowerCase().includes(filter) ||
            student.prefix.toLowerCase().includes(filter) ||
            student.grade.toLowerCase().includes(filter)
        );
        currentPage = 1;
        populateTable(filteredStudents);
        updatePagination(filteredStudents);
    });

    dataPerPageSelect.addEventListener('change', () => {
        studentsPerPage = parseInt(dataPerPageSelect.value);
        currentPage = 1;
        populateTable(students, currentPage, studentsPerPage);
        updatePagination(students);
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            populateTable(students, currentPage, studentsPerPage);
            updatePagination(students);
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(students.length / studentsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            populateTable(students, currentPage, studentsPerPage);
            updatePagination(students);
        }
    });

    document.addEventListener('click', event => {
        if (event.target.classList.contains('delete-icon')) {
            currentDeleteId = event.target.getAttribute('data-id');
            document.getElementById('deleteModal').style.display = 'block';
        }

        if (event.target.classList.contains('edit-icon')) {
            const id = event.target.getAttribute('data-id');
            const student = students.find(student => student.number == id);
            if (student) {
                document.getElementById('editNumber').value = student.number;
                document.getElementById('editPrefix').value = student.prefix;
                document.getElementById('editName').value = student.name;
                document.getElementById('editGrade').value = student.grade;
                document.getElementById('editModal').style.display = 'block';
            }
        }
    });

    document.getElementById('editForm').addEventListener('submit', event => {
        event.preventDefault();
        const number = document.getElementById('editNumber').value;
        const prefix = document.getElementById('editPrefix').value;
        const name = document.getElementById('editName').value;
        const grade = document.getElementById('editGrade').value;
        const index = students.findIndex(student => student.number == number);
        if (index !== -1) {
            students[index] = { number, prefix, name, grade };
            populateTable(students, currentPage, studentsPerPage);
            updatePagination(students);
            document.getElementById('editModal').style.display = 'none';
        }
    });

    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            document.getElementById('editModal').style.display = 'none';
            document.getElementById('deleteModal').style.display = 'none';
        });
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        document.getElementById('deleteModal').style.display = 'none';
    });

    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (currentDeleteId !== null) {
            const index = students.findIndex(student => student.number == currentDeleteId);
            if (index !== -1) {
                students.splice(index, 1);
                populateTable(students, currentPage, studentsPerPage);
                updatePagination(students);
            }
            currentDeleteId = null;
            document.getElementById('deleteModal').style.display = 'none';
        }
    });

    populateTable(students, currentPage, studentsPerPage);
    updatePagination(students);
});
