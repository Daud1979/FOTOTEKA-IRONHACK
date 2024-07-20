const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const ColorThief = require('colorthief');
const validator = require('validator');
const bodyParser = require('body-parser');
const _ = require('lodash');
const objImg = [];

const carpeta = './public';
/*carpeta*/
let id =0;
app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
//escucha en el puerto
app.listen(3000, () => {
    console.log("CONEXION ACTIVA");
});
//carga imagenes de plesitoceno
//const images = listarImagenesSync();
//carga la primer pagina pleistocenos
app.get('/fotosironhack', (req, res) => {
    const directoryPath = path.join(__dirname, 'public/ironhack');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        const images=[];
        // Filtrar solo archivos de imagen (opcional)
        const img = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        img.forEach(element => {
           images.push('ironhack/'+element);
        });
       
        res.render('home', {
            images
        });
    });
});
//lista desde carpeta
function listarImagenesSync() {
    const directoryPath = path.join(__dirname, 'public/ironhack');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return ('NO HAY IMAGENES');
        }
        // Filtrar solo archivos de imagen (opcional)
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        return (images);
    });
}
//apura a la pagina de registrar imagenes para la fototeca
app.get('/register', (req, res) => {
    res.render('imgRegister', {
        objImg
    });
});
//con el input busqueda va buscando caracter por caracter
app.post('/searchCollage',(req, res) => {
    const { search } = req.body;
    console.log(search);
    const newObjImg = objImg.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
     
      if (newObjImg.length>0)
      {
        res.send( newObjImg );
      }
      else{
        res.status(404).send('404');
      }

});
//carga las imagenes en la pagina de collage
app.get('/', (req, res) => {
    res.render('Collage', {
        objImg
    });
});
//funcion para remover un objeto, y devuelve el mismo objeto sin lo eliminado
const removeItem = (id) => {
    _.remove(objImg, item => item.id === id);
};
//llega el pedido post de eliminar un objeto mediante el id
app.post('/deleteimg',(req,res)=>{
    const id= req.body.id;   
    removeItem(id);    
   res.send({id});
}); 

//verifica la url, y registra en el array de objeto 
app.post('/add-image-form', async (req, res) => {
    let msg;
    let messaje;
    let texto;
    const { title, imgUrl, imgDate,imgCategory } = req.body;
    const verificar = objImg.some(img => img.imgUrl === imgUrl);

    if (validator.isURL(imgUrl)) {
        if (!verificar) {
            const dominantColor = await getDominantColor(imgUrl);
            let ultimoObjeto=0;
            const colors = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
            const pintar = `background: rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]});`;
            if (objImg.length==0){
                id=1;
            }
            objImg.push({ id:id++, title, imgUrl, imgDate, colors, pintar,imgCategory });
            objImg.sort((a, b) => new Date(b.imgDate) - new Date(a.imgDate));
            messaje = `Total de Imagenes ${objImg.length}`;
            msg = 1;//registro
            texto = "SE REGISTRO LA IMAGEN";
        }
        else {
            msg = 0;//ya existe
            messaje = "";
            texto = `LA IMAGEN YA EXISTE`;
        }
    }
    else {
        msg = 2;//url no valida
        messaje = "";
        texto = `URL NO VALIDO`;
    }
    res.send({ texto, messaje, msg });
});
//devuelve en color dominante de una imagen, en formato rgb la funcion debe ser async "/add-image-form" 
async function getDominantColor(imagePath) {
    try {
        const color = await ColorThief.getColor(imagePath);
        return color;
    } catch (err) {
        console.error('Error getting color:', err);
        return null;
    }
}
//si no encuentra alguna direccion en la url, manda mensaje de error 404 carga pagina 404
app.use((req, res, next) => {
    res.status(404).render('error');
});