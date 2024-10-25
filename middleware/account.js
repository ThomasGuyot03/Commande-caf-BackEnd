const findAccount = (origin) => {
    let accountId 
    if (origin.headers.origin === "http://thomasguyot.local:8080") {
        accountId = "66e964f0c8bf10e1ef23bb9b" 
    } else if (origin.headers.origin === "http://commandedat.netlify.app") {
        accountId = "66e964aec8bf10e1ef23bb9a"
    }
    return accountId    
  }

module.exports = { findAccount }