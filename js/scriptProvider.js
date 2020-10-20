export function ConvertBase64ToObject(base64){
    try {   
        return JSON.parse(arrayBufferToStringMain(base64));
    } catch (error) {
        console.log(error);
    }    
}

export function CreateValidation(Username , Password){
    try {

        var webMsg = new WebSocketMessage();
        webMsg.MsgType = 1;


        var vald = new Validation();
        vald.Username = Username; 
        vald.Password= Password;

        //Add to WebSocketMessage 
        webMsg.Message = vald;

        //Convert to Json String
        var jsonString2 = JSON.stringify(webMsg);

        //Convert Json String to UTF8 Array
        var arrayUTF8 = toUTF8Array(jsonString2); 

        //Convert arrayUTF8 to Uint8Array 
        var byteNumbers = new Uint8Array(arrayUTF8.length);

        for (var i = 0; i < arrayUTF8.length; i++) {
            byteNumbers[i] = arrayUTF8[i]; 
         }

         return byteNumbers;

    } catch (error) {
        console.log('Validation ' + error);
    }
}

export function SubscribeToAgriChannel(){

    try {

        //5 = Agri Channel

        var webMsg = new WebSocketMessage();                
        webMsg.MsgType = 5;


        //Convert to Json String
        var jsonString2 = JSON.stringify(webMsg);

        //Convert Json String to UTF8 Array
        var arrayUTF8 = toUTF8Array(jsonString2); 

        //Convert arrayUTF8 to Uint8Array 
        var byteNumbers = new Uint8Array(arrayUTF8.length);

        for (var i = 0; i < arrayUTF8.length; i++) {
            byteNumbers[i] = arrayUTF8[i]; 
        }

        return byteNumbers;

    } catch (error) {
        console.log('AfterValidationMsg ' + error);
    }
}


function toUTF8Array(str) {
    let utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function arrayBufferToStringMain(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}



//Classes

function WebSocketMessage() {
    this.MsgType = "unknown";
    this.Message = "unknown";   
};

function Validation() {
    this.Username = "unknown";
    this.Password = "unknown";
}; 
