document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const dailyView = document.querySelector('.daily-view');
    const monthlyView = document.querySelector('.monthly-view');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');

            // Toggle views
            if (btn.dataset.view === 'monthly') {
                dailyView.classList.add('hidden');
                monthlyView.classList.add('active');
            } else {
                dailyView.classList.remove('hidden');
                monthlyView.classList.remove('active');
            }
        });
    });
}); 