var express = require("express");
var router = express.Router();
const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: "http://localhost:8090/api/collections/escuela_de_maestros/records",
});
/*
  Cuando llegue un GET a la ruta /
  En lugar de obtener los datos de FakeDate, vamos a obtenerlos
  del PocketBase.
  Para hacer esa consulta lo hacemos mediante un Request HTTP utilizando Axios
*/

router.get("/", function (req, res, next) {
  // 1) Obtenemos los personajes del PocketBase
  console.log("Este es un breakpoint");
  axiosInstance.get().then((resp) => {
    // 2) Hacemos algún procesamiento de ser necesario
    // 3) Respondemos al cliente con la información obtenida
    console.log(resp);
    res.json(resp.data);
  });
});

/*
  Agregamos la posibilidad de seleccionar un personaje en particular.
  Esta selección la hacemos por id, mapeado en el lugar de :id

*/
router.get("/:id", (req, res) => {
  // 1) Obtenemos los personajes del PocketBase
  var idRequest = parseInt(req.params["id"]);
  axiosInstance.get().then((resp) => {
    // 2) Hacemos algún procesamiento de ser necesario
    var respuesta = resp.data.items.find(
      (elemento) => elemento.personaje["id"] === idRequest
    );

    // 3) Respondemos al cliente con la información obtenida
    if (respuesta === undefined) {
      res.send("No se encontró el elemento buscado");
    } else {
      res.json(respuesta.personaje);
    }
  });
});

/*
  En este endpoint podemos agregar un personaje.

  POST /characters/

  Body : 
  {
    "id": 1,
    "name": "Objeto modificado",
    "status": "Alive",
    "species": "Técnico",
    "type": "",
    "gender": "Male",
    "origin": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/1"
    },
    "location": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/20"
    },
    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2"
    ],
    "url": "https://rickandmortyapi.com/api/character/1",
    "created": "2017-11-04T18:48:46.250Z"
}
*/
router.post("/", (req, res) => {
  const personajeParaAgregar = req.body;

  const postBody = {
    personaje: personajeParaAgregar,
  };

  axiosInstance.post("/", postBody).then((respuesta) => {
    console.log(respuesta);
    res.send(respuesta.data.personaje);
  });
});

/*
  En este endpoint podemos modificar un personaje.

  PUT /characters/:id

  En el body tenemos que poner EXACTAMENTE cómo queremos que quede el objeto
  El id para saber qué objeto vamos a modificar lo ponemos en la ruta en el campo :id

  Body : 
  {
    "id": 1,
    "name": "Objeto modificado",
    "status": "Alive",
    "species": "Técnico",
    "type": "",
    "gender": "Male",
    "origin": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/1"
    },
    "location": {
        "name": "Earth",
        "url": "https://rickandmortyapi.com/api/location/20"
    },
    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    "episode": [
        "https://rickandmortyapi.com/api/episode/1",
        "https://rickandmortyapi.com/api/episode/2"
    ],
    "url": "https://rickandmortyapi.com/api/character/1",
    "created": "2017-11-04T18:48:46.250Z"
}
*/

router.put("/", (req, res) => {
  var body = req.body;

  var idBuscado = parseInt(body["id"]);
  axiosInstance.get().then((resp) => {
    var elementoAModificar = resp.data.items.find(
      (elemento) => elemento.personaje["id"] === idBuscado
    );

    var idDelElemento = elementoAModificar.id;
    var nuevoElemento = {
      personaje: body,
    };
    axiosInstance
      .patch("/" + idDelElemento, nuevoElemento)
      .then((respuesta) => {
        console.log(respuesta);
        res.send(respuesta.data.personaje);
      });
  });
});

router.delete("/:id", (req, res) => {
  var idBuscado = parseInt(req.params["id"]);
  axiosInstance.get().then((resp) => {
    var elementoAEliminar = resp.data.items.find(
      (elemento) => elemento.personaje["id"] === idBuscado
    );

    if (elementoAEliminar) {
      var idDelElementoABorrar = elementoAEliminar.id;
      axiosInstance.delete("/" + idDelElementoABorrar).then((respuesta) => {
        console.log(respuesta);
        res.send("Se eliminó correctamente el elemento");
      });
    } else {
      res.send("El elemento no se encontraba en la BD");
    }
  });
});

module.exports = router;
