document.getElementById("applicationForm").addEventListener("submit", async function(event) {
  event.preventDefault(); //Prevent default form submission

  let isValid =true;
  document.querySelectorAll(".error-message").forEach(el =>el.innerText ="");

  //First Name & last name Validation
  function validateName(id, message){
    const name = document.getElementById(id).value.trim();
    if(name.length <3){
      document.getElementById(id).nextElementSibling.innerText = message;
      isValid = false;
    }
  }
  validateName("firstname", "First Name must be at least 3 characters.");
  validateName("lastname", "Last Name must be at least 3 characters.");

  //Date of birth Validation (At least 16 years old)
  const dob = document.getElementById("dob").value;
  if (dob){
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age <16 ){
      document.getElementById("dob").nextElementSibling.innerText = "You must be at least 16 years old.";
      isValid = false;
    }
  }  else{
      document.getElementById("dob").nextElementSibling.innerText = "Date of birth is required.";
      isValid = false;
    }

    //Email Validation
    const email = document.getElementById("email").value.trim();
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if(!email.match(emailPattern)){
      document.getElementById("email").nextElementSibling.innerText = "Enter a valid email address";
      isValid = false;
    }

    //Password validation
    const password = document.getElementById("password").value;
    if (password.length < 6){
      document.getElementById("password").nextElementSibling.innerText = "Password must be at least 6 characters.";
      isValid = false;
    }

    //Mobile Number validation(10 digits)
    const number = document.getElementById("number").value.trim();
    if (!/^\d{10}$/.test(number)){
      document.getElementById("number").nextElementSibling.innerText = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }

    //Gender Validation
    const genderError = document.getElementById("genderError")
    if(!document.querySelector('input[name="gender"]:checked')){
      genderError.innerText = "Select your gender.";
      isValid = false;
    }

    //Course Selection Validation
    if (document.getElementById("course").value ===""){
      document.getElementById("course").nextElementSibling.innerText = "Select your course.";
      isValid = false;
    }

    //Address validation
    const address = document.getElementById("address").value.trim();
    if(address === ""){
      document.getElementById("address").nextElementSibling.innerText = "Address cannot be empty.";
      isValid = false;
    }

    // If Validation fails, do not submit the form
    if(!isValid){
      return;
    }
  
  console.log("Submit button clicked!")

  let formData = new FormData(this);
  let data = Object.fromEntries(formData.entries());

  data.Hobbies = formData.getAll("Hobbies");

  console.log("Sending data to the server:", data);

  try{
  const response = await fetch("http://localhost:3000/submit-form",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  let result = await response.json();
  if(response.ok){
    alert(result.message);
    window.location.href = "display.html";
  } else {
    alert("Form submission failed!");
  }
  console.log("Server response:", result)
  alert(result.message);
} catch (error){
  console.error("Error submitting form:", error);
  alert("Something went wrong! check console logs.")
}
});