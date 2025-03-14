document.addEventListener('DOMContentLoaded', function() {
  // Form submission handling
  const consultationForm = document.getElementById('consultation-form');
  
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Get form data
      const formData = new FormData(consultationForm);
      const formDataObj = {};
      formData.forEach((value, key) => { formDataObj[key] = value });
      
      // In a real scenario, you would send this data to a server
      // For now, we'll just save it to localStorage and show a confirmation
      localStorage.setItem('lastConsultationRequest', JSON.stringify(formDataObj));
      
      // Show confirmation message
      const formContainer = document.querySelector('.consultation-form');
      formContainer.innerHTML = `
        <div class="form-success">
          <h3>Thank you for booking a consultation!</h3>
          <p>I'll contact you within 24 hours to confirm our meeting.</p>
          <p>If you don't hear back, please email me directly at <a href="mailto:albimetamail@gmail.com">albimetamail@gmail.com</a>.</p>
        </div>
      `;
      
      // Scroll to confirmation message
      formContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }
});