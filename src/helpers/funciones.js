// Función para saludar
// module.exports.saludar =  function() {
//   return '¡Hola desde funciones.js!';
// }

// // Función para sumar dos números
// module.exports.sumar = function(a, b) {
//   return a + b;
// }

// try {
//     const response = await fetch(urlApi + 'api/distrito/' + fields.id_provincia + '/' + fields.id_departamento , config)
    
//     if (!response.ok) {
//         throw new Error(`Error de red: ${response.status}`);
//     }
    
//     const jsonResponse = await response.json()

//     jsonResponse.data.forEach((value, index) => {
//         objDistrito.push({ name: value.descripcion, code: value.id_departamento})
//     });
    
// } catch (error) {
//     console.error('Error al realizar la solicitud:', error.message);
// }
const urlApi = import.meta.env.VITE_APP_URL_API

export function printError(respt) {    
    let arrResponse = {errors: null, messageError: null}
    
    if (respt.response) {
        const response = respt.response
        if (response.status == 422) { arrResponse.errors = response.data.errors } //Valida que los campos sean obligatorio
        arrResponse.messageError = response.data.message
    } else {
        console.error(respt)
    }
    return arrResponse 
}

export function printAlert(type = 'success', message = '', timeLife = 3000) {
    const arrMessage = { success: 'Exito', warn: 'Advertencia' }
    toast.add({ severity: type, summary: arrMessage[type], detail: message, life: timeLife })
}

export function getToken() {
    let authToken = localStorage.getItem('jwt')
    return authToken
}

export function deleteToken() {
    if (!isTokenValided()) { return false }

    delete localStorage.jwt
    return true
}

export function isTokenValided() {
    let authToken = getToken()

    if (!authToken) { return false }     
    return true
}

export function isTokenActive() {
    let authToken = getToken()
    if (!authToken) { return false }

    let tokenSplit = JSON.parse(atob(authToken.split('.')[1]))
    let current_time = Date.now() / 1000
    
    if (tokenSplit.exp < current_time) { return false }
    return true
}

export function invalidateToken() {
    if (!isTokenActive()) { return false }

    return new Promise((resolve, reject) => {
        axios.post('logout', {'access_token': getToken()}).then(respt => {
            if (respt.status == 200) {
                const response = respt.data.data
                deleteToken()
                resolve(response)
            }
        }).catch(respt => {
            reject(respt)
        })
    })
}

export function configHeader (type = 1) {
    if (type = 1) { // axios
        return { headers: { Authorization: `Bearer ${getToken()}`} }
    } else if (type = 2)  { //fech
        return {
            method: 'get', 
            headers: new Headers({ 'Authorization': 'Bearer ' + getToken(),  'Content-Type': 'application/x-www-form-urlencoded'})
        }
    }
}

export function arrDepartamento() {    
    return new Promise((resolve, reject) => {
        const objResult = []
        axios.get('departamento').then(respt => {
            if (respt.status == 200) {
                const response = respt.data.data

                response.forEach((value, index) => {
                    objResult.push({ name: value.descripcion, code: value.id_departamento})
                });
                resolve(objResult)
            }
        }).catch(respt => {
            reject(respt)
        })
    })
}

export function arrProvincia(fields) {
    return new Promise((resolve, reject) => {
        const objResult = []
        if (fields.id_departamento) {
            axios.get('provincia/' + fields.id_departamento).then(respt => {
                if (respt.status == 200) {
                    const response = respt.data.data

                    response.forEach((value, index) => {
                        objResult.push({ name: value.descripcion, code: value.id_provincia})
                    })
                    resolve(objResult)
                }
            }).catch(respt => {
                reject(respt)
            })
        }
    })
}

export function arrDistrito(fields) {
    return new Promise((resolve, reject) => {
        const objResult = []

        if (fields.id_provincia && fields.id_departamento) {
            axios.get('distrito/' + fields.id_provincia + '/' + fields.id_departamento).then(respt => {
                if (respt.status == 200) {
                    const response = respt.data.data

                    response.forEach((value, index) => {
                        objResult.push({ name: value.descripcion, code: value.id_distrito})
                    })
                    resolve(objResult)
                }
            }).catch(respt => {
                reject(respt)
            })
        }
    })
}

export function getDataCombo(endPoint, paramet = []) {
    return new Promise((resolve, reject) => {
        const objResult = []        
        axios.get(endPoint).then(respt => {
            if (respt.status == 200) {
                const response = respt.data.data

                response.forEach((value, index) => {
                    objResult.push({ code: value[paramet.id], name: value[paramet.name]})
                })                
                resolve(objResult)
            }
        }).catch(respt => {
            reject(respt)
        })
    })
}