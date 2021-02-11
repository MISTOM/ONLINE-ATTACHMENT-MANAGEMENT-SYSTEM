const toggle = document.querySelector(".icon");
const board = document.querySelector(".board");
const board2 = document.querySelector(".board2");
const menu = document.querySelector(".menu");
const header = document.querySelector("header");
// const inputs = document.querySelectorAll(".form-control");
toggle.addEventListener("click", ()=>{
    toggle.classList.toggle("active");
    menu.classList.toggle("active");
    header.classList.toggle("active");
    board2.classList.toggle("active");
});
toggle.addEventListener("click", ()=>{
    board.classList.toggle("active");
});






// function myFunction(x) {
//     console.log("breaked");
//     var x = window.matchMedia("(max-width: 576px)")
//     if (x.matches) { // If media query matches
//       inputs.classList.remove("form-control-lg")  
//       inputs.classList.add("form-control-md")
//     }else{
//         inputs.classList.add('form-control-md');
//     }
//   }
  
//   myFunction(x); // Call listener function at run time
//   x.addListener(myFunction); // Attach listener function on state changes
