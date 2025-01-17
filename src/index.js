// index.js
//const ramenMenu = document.querySelector("#ramen-menu")
//const ramenDetail = document.querySelector("#ramen-detail")
//const formAdd = document.querySelector("#new-ramen")
//const formUpdate = document.querySelector("#edit-ramen")
//const formDelete = document.querySelector("#delete-ramen")
const ramenArray = []

// Callbacks
function handleClick(ramen){
  // Add code
  const ramenDetail = document.querySelector("#ramen-detail") //
  ramenDetail.querySelector("img").src = ramen.image
  ramenDetail.querySelector("h2").textContent = ramen.name
  ramenDetail.querySelector("h3").textContent = ramen.restaurant
  document.querySelector("#rating-display").textContent = ramen.rating
  document.querySelector("#comment-display").textContent = ramen.comment
};

const addSubmitListener = () =>{
  // Add code
  const formAdd = document.querySelector("#new-ramen")
  formAdd.addEventListener("submit", handleSubmit)
  function handleSubmit(eventObject){
    eventObject.preventDefault()
    const newRamen = {
      name: formAdd.querySelector("#new-name").value,
      restaurant: formAdd.querySelector("#new-restaurant").value,
      image: formAdd.querySelector("#new-image").value,
      rating: formAdd.querySelector("#new-rating").value,
      comment: formAdd.querySelector("#new-comment").value,
    }
    //displayRamens(newRamen)
    const ramenMenu = document.querySelector("#ramen-menu")
    const newRamenImg = document.createElement("img")
    newRamenImg.src = newRamen.image
    ramenMenu.appendChild(newRamenImg)
    //add click listner to new element
    newRamenImg.addEventListener("click", ()=>handleClick(newRamen))

    //Post to Server:
    const configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(newRamen),
    }
    fetch("http://localhost:3000/ramens", configurationObject)
    .then(resp => resp.json())
    .then(data => console.log(data))
  } 
}

const addUpdateListener = () =>{
  const formUpdate = document.querySelector("#edit-ramen")
  formUpdate.addEventListener("submit", handleUpdate)
  function handleUpdate(eventObject){
    eventObject.preventDefault()
  
    document.querySelector("#rating-display").textContent = formUpdate.querySelector("#edit-rating").value
    document.querySelector("#comment-display").textContent = formUpdate.querySelector("#edit-comment").value

    const currentSelectedRamen = ramenArray.find(element => element.name === 
      document.querySelector("#ramen-detail .name").textContent)

    currentSelectedRamen.rating = formUpdate.querySelector("#edit-rating").value
    currentSelectedRamen.comment = formUpdate.querySelector("#edit-comment").value
    
    //Patch Item in server
    fetch(`http://localhost:3000/ramens/${currentSelectedRamen.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(currentSelectedRamen)
    })
    .then(resp => resp.json())
    .then(data =>{
      console.log(data)
    })
  }
}


function addDeleteListener(){

  const formDelete = document.querySelector("#delete-ramen")
  formDelete.addEventListener("submit", handleDelete)
  function handleDelete(eventObject){
    eventObject.preventDefault()
  
    const currentSelectedRamenImg = document.querySelector("#ramen-detail .detail-image").src  
    const ramenList = document.querySelectorAll("div#ramen-menu img")
    for(let item of ramenList){
      if(item.src === currentSelectedRamenImg){
        item.remove()
      }
    }
  
    //Delete in server:
    const currentSelectedRamen = ramenArray.find(element => element.name === 
      document.querySelector("#ramen-detail .name").textContent)

    fetch(`http://localhost:3000/ramens/${currentSelectedRamen.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    })
    .then(resp => resp.json())
    .then(data =>{
      console.log(data)
    })

    //Delete in Dom:
    //ramenDetail.querySelector("img").src = "./assets/image-placeholder.jpg"
    ramenDetail.querySelector("img").src = "https://placehold.co/600x400?text=Please+choose+a+ramen"
    ramenDetail.querySelector("h2").textContent = "N/A"
    ramenDetail.querySelector("h3").textContent = "N/A"
    document.querySelector("#rating-display").textContent = "N/A"
    document.querySelector("#comment-display").textContent = "N/A"
  }
}


const displayRamens =() =>{
  // Add code
  fetch("http://localhost:3000/ramens")
  .then(resp => resp.json())
  .then(data =>{ 
    //console.log(data)
    const ramenMenu = document.querySelector("#ramen-menu") //
    data.forEach(
      element =>{
        const img = document.createElement("img")
        img.src = element.image
        //ramenMenu.appendChild(img)
        img.addEventListener("click", ()=>handleClick(element)) //handleClick.bind(element)
        ramenMenu.appendChild(img)
        ramenArray.push(element)
      }
    )
    /*
    const ramenImages = ramenMenu.querySelectorAll('img')
    console.log(ramenImages.length)
    */

    //Advanced Deliverables:
    const ramenDetail = document.querySelector("#ramen-detail")
    ramenDetail.querySelector("img").src = data[0].image
    ramenDetail.querySelector("h2").textContent = data[0].name
    ramenDetail.querySelector("h3").textContent = data[0].restaurant
    document.querySelector("#rating-display").textContent = data[0].rating
    document.querySelector("#comment-display").textContent = data[0].comment
  })
  /*
  .catch(error => {
    console.log("error fetching from ramen API:", error)
  })
  */
};

const main = () => {
  displayRamens()
  addSubmitListener()
  addUpdateListener()
  addDeleteListener()
}

document.addEventListener("DOMContentLoaded", main)  //main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
