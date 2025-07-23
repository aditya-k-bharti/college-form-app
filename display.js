async function fetchData() {
  try{
    let response = await fetch("http://localhost:3000/get-applications");
    let data = await response.json();

    console.log("Fetched data:", data)

    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    data.forEach(user =>{
      let row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.FirstName} ${user.LastName}</td>
      <td>${user.Email}</td>
      <td>${user.MobileNo}</td>
      <td>${user.Gender}</td>
      <td>${user.Course}</td>
      <td>
        <button onclick ="editUser('${user.Id}')">Edit</button>
        <button onclick ="deleteUser('${user.Id}')">Delete</button>
      </td>
      `;
      table.appendChild(row);
    });
  } catch(error){
    console.log("Error fetching data:",error);
  }
}


async function editUser(userID) {
  let newName = prompt("Enter new name:");
  let newEmail = prompt("Enter new email:");
  
  if(newName && newEmail){
    let response = await fetch(`http://localhost:3000/update-user/${userID}`,{
      method:"PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ FirstName: newName, Email: newEmail }),
    });

    let result = await response.json();
    alert(result.message);
    fetchData();
  }
}

async function deleteUser(userID) {
  if(confirm("Are you sure you want to delete this record?")){
    let response = await fetch(`http://localhost:3000/delete-user/${userID}`,{
      method:"DELETE",
    });

    let result = await response.json();
    alert(result.message);
    fetchData();
  }
}

fetchData();