const findAccount = (origin) => {
    let accountId 
    console.log(origin.headers.origin)
    if (origin.headers.origin === "http://thomasguyot.local:8080") {
        accountId = "66e964f0c8bf10e1ef23bb9b" 
    } else if (origin.headers.origin === "https://dat-commande.com") {
        accountId = "66e964aec8bf10e1ef23bb9a"
    }
    return accountId    
  }

module.exports = { findAccount }