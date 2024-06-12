## UNIVERSIDAD DE SAN CARLOS DE GUATEMALA
## FACULTAD DE INGENIERIA
## ESCUELA DE CIENCIAS Y SISTEMAS DE COMPUTACIÓN
## SISTEMAS OPERATIVOS 1
## PROYECTO 1
Desarrollado por: Angel Torcelli - 201801169

## Resumen
El siguiente programa consiste en un sistema de monitoreo de recursos del sistema y gestión de procesos, empleando varias tecnologías y lenguajes de programación.  El sistema resultante permite obtener información clave sobre el rendimiento del computador, procesos en ejecución y su administración a través de una interfaz amigable.

Las tecnologías utilizadas son:
- Vite (react)
- GO
- MySQL
- Virtual box (Ubuntu server 22.04)
- NGINX (reverse proxy)
- Docker

## Arquitectura
Para el presente proyecto se utilizó la siguiente arquitectura.
![Alt text](./img/image.png)

## Frontend
Para el desarrollo de la interfaz de usuario, se utilizó la herramienta **VITE** ya que nos permite crear aplicaciónes de React mucho más rápido y eficiente. La comunicación con el backend se realizó a traves de la herramienta NGINX, descrita a continuación.

### NGINX
Esta herramienta se utilizó con el motivo de utilizar un reverse proxy para manejar la comunicación entre el frontend y el backend, evitando el uso de variables de entorno.
Para ello fue necesario realizar un dockerfile multistage para crear la imagen de react junto a la de nginx de la siguiente forma:
```txt
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# Step 2: Set up the production environment
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
Al utilizar el reverse proxy, fue posible realizar las peticiónes como si se realizarán a la misma dirección donde se ejecuta el frontend, de la siguiente forma.

```node
const response = await fetch("/frontend-app/getcpu", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
```
A grandes rasgos, el reverse proxy configurado de la siguiente manera en el nginx.conf redirigirá la petición a la dirección que se especifica a continuación:

```node
   location /frontend-app/ {
        proxy_pass http://backend:8080/;
   }
```
Por lo que la petición anterior se traduciría como:
```node
const response = await fetch("/backend:8080/getcpu", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
```
Cabe recalcar que la direcció que se configura en el proxy_pass es el nombre de nuestro servicio, especificado en el docker_compose.yml


## Backend
### Modulos
Para la lectura de procesos de CPU se realizó un programa en **C** en los cuales se incluye varios encabezados necesarios para trabajar con el kernel de Linux, como linux/module.h, linux/init.h, linux/proc_fs.h, linux/sched/signal.h, linux/seq_file.h, linux/fs.h, y linux/mm.h. A su vez se definió una función escribir_a_proc que es llamada cuando se accede al archivo /proc/modulo_cpu. Esta función recopila información sobre el CPU y los procesos en ejecución.

La información recopilada se organiza en formato JSON y se escribe en el archivo /proc/modulo_cpu para que los usuarios del sistema puedan acceder a estos datos.

Para la lectura de procesos de RAM se realizó un programa en **C** que incluyen varios encabezados necesarios para trabajar con el kernel de Linux, como linux/module.h, linux/proc_fs.h, linux/sysinfo.h para la información de RAM, linux/seq_file.h, y linux/mm.h
Se definió también una función escribir_a_proc que es llamada cuando se accede al archivo /proc/modulo_ram. Esta función recopila información sobre la RAM del sistema, como la cantidad total de RAM, RAM utilizada, porcentaje de uso y RAM libre.

Para la recopilación de datos, dentro de escribir_a_proc, se utiliza la función si_meminfo para obtener la información de RAM del sistema y se calcula el porcentaje de uso y la cantidad de RAM libre. Y se procede a escribir escribir en el archivo /proc/modulo_ram para acceder a la información.


### API
Para el manejo de la lógica de la aplicación se realizó un programa en **GO** el cual se utilió como API a la cual se realizan las peticiónes para obtener toda la información necesaria y manejar los datos.
A continuación se muestra el script para la creación de la base de datos y la tabla donde se guardan los registros:
```sql
CREATE DATABASE historicos;

use historicos;

CREATE TABLE uso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ram BIGINT UNSIGNED,
    cpu BIGINT UNSIGNED
);
```

Endpoints:
```go
func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/", HomeHandler)
	mux.HandleFunc("/start", StartProcess)
	mux.HandleFunc("/stop", StopProcess)
	mux.HandleFunc("/resume", ResumeProcess)
	mux.HandleFunc("/kill", KillProcess)
	mux.HandleFunc("/getram", GetRAM)
	mux.HandleFunc("/getcpu", GetCPU)
	mux.HandleFunc("/getpid", GetPid)
	mux.HandleFunc("/registroHistorico", registroHistorico)
	mux.HandleFunc("/getHistoricos", getHistoricos)

	// Configurar CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // o los orígenes que desees permitir
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization", "Accept", "X-Requested-With", "Origin", "Access-Control-Allow-Origin"},
		Debug:          true, // Cambia a false en producción
	}).Handler(mux)
	fmt.Println("El servidor está escuchando en el puerto 8080")

	go func() {

		if err := http.ListenAndServe(":8080", corsHandler); err != nil {
			fmt.Println("Error al iniciar el servidor" + err.Error())
		}
	}()

	select {}
}
```
La api cuenta con todos los métodos necesarios para el manejo de cada petición que se le solicite.

## Base de datos
La base de datos se utilizó para almacenar los datos historicos de las lecturas de utilización de memoria RAM y CPU a través de este endpoint:
```go
	mux.HandleFunc("/registroHistorico", registroHistorico)
	mux.HandleFunc("/getHistoricos", getHistoricos)
```
A continuación se presenta el método con el se guarda la información en la base de datos.
```go
func registroHistorico(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var dat DatosHistoricos

	json.NewDecoder((request.Body)).Decode(&dat)

	query := `INSERT INTO uso(ram, cpu) VALUES (?,?);`
	result, err := conexion.Exec(query, dat.RAM, dat.CPU)
	if err != nil {
		fmt.Println(err)
	}
	lastInsertID, _ := result.LastInsertId()
	fmt.Println("Se ha insertado Correctamente: ", lastInsertID)
	json.NewEncoder(response).Encode(dat)
}
```

A continuación se muestra el método de donde se obtiene la data de la base de datos.
```go
func getHistoricos(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var lista []DatosHistoricos
	query := "select * from uso;"
	result, err := conexion.Query(query)
	if err != nil {
		fmt.Println(err)
	}

	for result.Next() {
		var logc DatosHistoricos

		err = result.Scan(&logc.ID, &logc.RAM, &logc.CPU)
		if err != nil {
			fmt.Println(err)
		}
		lista = append(lista, logc)
	}
	json.NewEncoder(response).Encode(lista)
}
```
## Docker compose
Para facilitar el despliegue de la aplicación se utilizó docker compose, el cuál se configuró de la siguiente manera:
```txt
version: '3'
services:
  base:
    image: "mysql"
    container_name: 'MYSQL_Base_v2'
    environment:
      MYSQL_ROOT_PASSWORD: secret
    volumes:
      - base_mysql:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - app-network

  backend:
    image: "angeltorc/backendgo"
    container_name: 'BackendGo'
    restart: always
    privileged: true
    pid: "host"
    volumes:
      - type: bind
        source: /proc
        target: /proc
    environment:
      DB_USER: root
      DB_PASSWORD: secret
      DB_HOST: base  # Cambiado a 'base' que coincide con el nombre del servicio de MySQL
      DB_PORT: 3306
      DB_NAME: historicos
    ports:
      - "8080:8080"
    networks:
      - app-network

  frontend:
    image: 'angeltorc/frontendvite'
    container_name: 'FrontVite'
    restart: always
    ports:
      - '80:80'  
    networks:
      - app-network
    depends_on:
      - backend

networks:
  app-network:
    driver: bridge

volumes:
  base_mysql:

```
Como se puede observar se utilizó un volumen para la base de datos para la persistencia de los datos aun cuando el contenedor no este en ejecución.


## Virtual machine
Para el despliegue de la aplicación se utilizó Ubuntu server 22.04 el cual se instaló en una maquina virtual, utilizando VirtualBox. 
![Alt text](./img/image-1.png)



