function showLoginPage() {
  document.querySelector('.form-container').style.display = 'none';
  document.querySelector('.styled-table').style.display = 'none';
  document.querySelector('.footer-container').style.display = 'none';
  document.querySelector('.login-container').style.display = 'block';
}
  document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.querySelector('.signup-form');
  const loginForm = document.querySelector('.login-form');

  // Sign up functionality
  if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const fullname = document.getElementById('fullname').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const confirmPassword = document.getElementById('confirm-password').value;

          if (password !== confirmPassword) {
              alert("Passwords do not match!");
              return;
          }

          const userData = { fullname, email, password };

          try {
              const response = await fetch('/signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
              });

              const result = await response.json();
              console.log('Signup response:', result); // Log the response for debugging

              if (response.ok) {
                  alert(result.message);
                  window.location.href = 'login.html'; // Redirect to login page
              } else {
                  alert(result.message);
              }
          } catch (error) {
              console.error('Error during signup:', error);
              alert('An error occurred while signing up. Please try again.');
          }
      });
  }

  // Sign in functionality
  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          // Hardcoded login check (for testing purposes)
          if (email === 'test@example.com' && password === 'password123') {
              alert('Login successful');
              window.location.href = 'index.html'; // Redirect to index page
              return; // Exit the function
          }

          const userData = { email, password };

          try {
              const response = await fetch('/signin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
              });

              const result = await response.json();
              console.log('Signin response:', result); // Log the response for debugging

              if (response.ok) {
                  alert(result.message);
                  window.location.href = 'index.html'; // Redirect to index page
              } else {
                  alert(result.message);
              }
          } catch (error) {
              console.error('Error during signin:', error);
              alert('An error occurred while signing in. Please try again.');
          }
      });
  }
showLoginPage();
});