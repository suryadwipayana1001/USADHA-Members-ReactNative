export const renameKey = (obj, old_key, new_key)=> {   
    // check if old key = new key  
    if (old_key !== new_key) {                  
        Object.defineProperty(obj, new_key, // modify old key
                            // fetch description from object
        Object.getOwnPropertyDescriptor(obj, old_key));
        delete obj[old_key];                // delete old key
    }
}