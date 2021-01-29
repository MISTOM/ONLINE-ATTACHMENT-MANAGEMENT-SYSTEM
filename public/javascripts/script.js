const toggle = document.querySelector(".icon");
const board = document.querySelector(".board");

const inputs = document.querySelectorAll(".form-control");

toggle.addEventListener("click", ()=>{
    toggle.classList.toggle("active");
    board.classList.toggle("active");
});

function myFunction(x) {
    console.log("breaked");
    var x = window.matchMedia("(max-width: 576px)")
    if (x.matches) { // If media query matches
      inputs.classList.remove("form-control-lg")  
      inputs.classList.add("form-control-md")
    }else{
        inputs.classList.add('form-control-md');
    }
  }
  
  myFunction(x); // Call listener function at run time
  x.addListener(myFunction); // Attach listener function on state changes
