let next = document.querySelector('.next')
let prev = document.querySelector('.prev')
let container = document.querySelector('.container');

 next.addEventListener('click', function(){   
     let items = document.querySelectorAll('.item');
     (items.length>0) ? document.querySelector('.slide').appendChild(items[0]) :undefined;        
 })
prev.addEventListener('click', function(){   
     let items = document.querySelectorAll('.item');   
     (items.length>0) ? document.querySelector('.slide').prepend(items[items.length - 1]): undefined;   
 })
