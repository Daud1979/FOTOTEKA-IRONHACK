

let limpiar  = document.getElementById('limpiar');
let title=document.getElementById('title');
let imgUrl = document.getElementById('imgUrl');
let btnEnviar = document.getElementById('btnenviar');
let texto = document.getElementById('texto');
let imgDate = document.getElementById('imgDate');
let counter = document.getElementById('counter');
let sele = document.getElementById('cmbselect');
limpiar.addEventListener('click',function(){
    title.value="";
    imgUrl.value="";
    texto.innerHTML='';
    texto.classList.remove('novalido');
    texto.classList.remove('valido');
});
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

btnEnviar.addEventListener('click',function(){
   
      if (title.value != '' && imgUrl.value!= '' && isValidDate(imgDate.value))
      {     
        
        if(title.value.length<30)
         {        
            texto.innerHTML="";
            texto.classList.remove('novalido');
            const data = {title: title.value,
                          imgUrl:imgUrl.value,
                          imgDate:imgDate.value,
                          imgCategory:sele.value};        
            fetch('/add-image-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
            console.log('Éxito:', data);
              if (data.msg==1)
              {
                
                counter.innerHTML=data.messaje;
                texto.classList.remove('novalido'); 
                texto.classList.add('valido');
                texto.innerHTML=data.texto;
                
                title.value="";
                imgUrl.value="";
                imgDate.value="";
              }
              else if (data.msg==0)
              {
                texto.innerHTML=data.texto;
                texto.classList.remove('valido');
                texto.classList.add('novalido');
              }
              else
              {
                texto.innerHTML=data.texto;
                texto.classList.remove('valido');
                texto.classList.add('novalido');
              }
            })
            .catch((error) => {
            console.error('Error:', error);
            
            });     
        }
        else
        {
          texto.classList.remove('valido');
          texto.innerHTML='EL TITULO DEBE TENER MENOS DE 30 CARACTERES';
          texto.classList.add('novalido');
        }
      } 
      else
      {
        texto.classList.remove('valido');
        texto.innerHTML='SE REQUIEREN DATOS PARA EL REGISTRO';
        texto.classList.add('novalido');
      }
});
function verificarImagen(url, callback) {
  let img = new Image();
  img.onload = function() {
      callback(true);
  };
  img.onerror = function() {
      callback(false);
  };
  img.src = url;
}
function valideKey(evt){    
    var code = (evt.which) ? evt.which : evt.keyCode;
 
    if(code==8) 
    { // backspace.
      return true;
    }
    else if(code==32)//space
    {
        return true;
    }
    else if (code==95)
    {

    }
    else if(code>=48 && code<=90) { // is a number.
      return true;
    } 
    else if(code>=97 && code<=122) { // is a number.
        return true;
      } 
    else{ // other keys.
      return false;
    }
}


  