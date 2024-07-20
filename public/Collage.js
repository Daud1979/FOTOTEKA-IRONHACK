const inputsearch = document.getElementById('txtsearch');
const containerCollage = document.querySelector('.containerCollage'); //contenedor total
const flexcontainer = document.querySelector('.flex-container');//contenedor imagenes

const countImage =document.querySelector('.countImage');
const btnX = document.querySelector('.esx');
window.addEventListener("load", () => {//focus al cargar la pagina
    inputsearch.focus()
  })
inputsearch.addEventListener('keyup',()=>{
    if (inputsearch.value != '')
    {       
        
           const search= inputsearch.value;
            const data = {search};     
            let p = document.createElement('p');
            const parent = flexcontainer.parentNode;     
            fetch('/searchCollage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
            .then(response => response.json())
            .then(data => {                
                if (data==404)
                {                                               
                    parent.removeChild(flexcontainer);   //remover cada que se encuentre mas busquedas      
                    p.innerText = `NO SE ENCONTRO IMAGENES EN LA BASE DE DATOS`;
                    p.classList.add('paviso');
                    containerCollage.appendChild(p);
                    inputsearch.focus();
                }
                else
                {         
                    countImage.innerHTML=`Total de Imagenes ${data.length}`;
                    console.log(data);             
                    eliminarHijosDiv();                            
                    data.forEach(element => {
                         const flexitemN = document.createElement('div');  
                         flexitemN.classList.add('flex-item'); 
                         flexitemN.classList.add('hijo'); 
                         flexcontainer.appendChild(flexitemN);
                         let imgN = document.createElement('img');             
                         imgN.src=element.imgUrl;
                         flexitemN.appendChild(imgN);
                     
                         const colorsN = document.createElement('div');  
                         flexitemN.appendChild(colorsN);
                         colorsN.classList.add('colors');
                     
                         let rgb = document.createElement('p');
                         rgb.classList.add('rgb');
                         colorsN.appendChild(p);
                         p.innerText=element.colors;
                     
                          const colorN = document.createElement('div');                          
                          colorN.classList.add('color');
                          colorN.style.backgroundColor=element.colors;
                          colorsN.appendChild(colorN);
                       
                          let pTitle = document.createElement('p');
                          let pSpan =document.createElement('span');
                          let pImg = document.createElement('p');
                          pTitle.classList.add('imgtitle');
                          pSpan.classList.add('categoria');
                          pImg.classList.add('imgdate');
                          pTitle.innerText=element.title.toUpperCase();
                          pSpan.innerHTML = element.imgCategory;
                          pImg.innerText=element.imgDate;
                          flexitemN.appendChild(pTitle);
                          pTitle.appendChild(pSpan);
                          flexitemN.appendChild(pImg);
                        
                         const btnX = document.createElement('button');                          
                         btnX.classList.add('esx');
                         btnX.id=element.id;  
                         btnX.onclick=function(){
                            if (confirm(`¿ ESTA SEGURO DE ELIMINAR EL IMAGEN? `) == true) {
                                const data = {id:element.id};                                                    
                                            
                                fetch('/deleteimg', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                    console.log(data);
                                    location.reload(true);
                                });
                            } 
                    
                        };      
                         btnX.innerHTML=`<i class="fas fa-trash-alt"></i>`;
                          flexitemN.appendChild(btnX);                      
                        
                       });
                }            
            })
            .catch((error) => {
                console.error('Error:', error);
            }); 
    }
    else
    {
        inputsearch.focus();
        location.reload(true);
        
    }   
});

function eliminar(codigo){
    
    if (confirm(`¿ ESTA SEGURO DE ELIMINAR EL IMAGEN? `) == true) {
        const data = {id:codigo};   
        console.log(data);             
        fetch('/deleteimg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
            console.log(data);
            location.reload(true);
        });
    }     

}

function eliminarHijosDiv() {
    
    var hijos =flexcontainer.getElementsByClassName("flex-item");   
    // Convertir a un array para evitar problemas con la colección en vivo
    hijos = Array.from(hijos);
    console.log(hijos);
    for (var i = 0; i < hijos.length; i++) {
        flexcontainer.removeChild(hijos[i]);
    }
  }

