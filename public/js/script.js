// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();

  function openBooking() {
    document.getElementById("bookingModal").style.display = "flex";
  }
  
  function closeBooking() {
    document.getElementById("bookingModal").style.display = "none";
  }
  
  window.onclick = function(event) {
    const modal = document.getElementById("bookingModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };