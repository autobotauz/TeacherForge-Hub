document.addEventListener('DOMContentLoaded', function() {
    // Grade band filtering
    const gradeBandBtns = document.querySelectorAll('.grade-band-btn');
    const toolCategories = document.querySelectorAll('.tool-category');

    function filterTools(grade) {
        gradeBandBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.grade === grade);
        });

        if (grade === 'all') {
            toolCategories.forEach(category => {
                category.classList.remove('hidden');
            });
        } else {
            toolCategories.forEach(category => {
                category.classList.toggle('hidden', category.dataset.grade !== grade);
            });
        }
    }

    gradeBandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTools(btn.dataset.grade);
        });
    });

    // Initialize with 'all' filter
    filterTools('all');
});