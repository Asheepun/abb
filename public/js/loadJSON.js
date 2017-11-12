const loadJSON = (...srcs) => new Promise((resolve, reject) => {
    const resJSON = {};

    for(let i = 0; i < srcs.length; i++){
        const jsonReq = new XMLHttpRequest();
    
        jsonReq.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                resJSON[srcs[i]] = JSON.parse(this.responseText);
                if(Object.keys(resJSON).length === srcs.length) resolve(resJSON);
            }
        }
        jsonReq.open("GET", "/assets/json/" + srcs[i] + ".json", true);
        jsonReq.send();
    }
});

export default loadJSON;