import { ConvertBase64ToObject  , CreateValidation , SubscribeToAgriChannel }  from './scriptProvider.js'

//Websocket Connection string
var socketType = 'ws://';
var socketAdress = 'Enter Socket Adress Here ';
var socketPort = 'Enter Socket Port Here'; 




//Build the connection string
var socketFullAdress = socketType + socketAdress + ':' + socketPort;

//Open the websocket connection
const socket = new WebSocket(socketFullAdress);

//Set socketType
socket.binaryType = 'arraybuffer';

//Socket Open 
socket.addEventListener('open', function (event) {    
    console.log('WebSocket Connected !');
});
// onSocket Error
socket.addEventListener('error', function (err) {
    console.log('WebSocket Error: ', err);
});

// onSocket Close
socket.addEventListener('close', function (e) {
    console.log('WebSocket connection closed.');
});

// Listen for messages
socket.addEventListener('message', function (e) {
 
	var _data = ConvertBase64ToObject(e.data);
    //Check for Info Status
	if(_data.Type == 200){

		if(_data.Connected){

			// Check if Validation is needed..
			if (!_data.isValidated) {
                var bytes = CreateValidation('Enter Username Here' , 'Enter Password here');
                
				  //Send byteArray to Websocket.
				  socket.send(bytes);
			}

            // After Validation send sub
			if(_data.isValidated){
				console.log('Validation is done send sub') 
				var subBytes = SubscribeToAgriChannel();
				socket.send(subBytes);			
			}

		}		
	}

	if (_data.Type == 11 ) {	

        //_data.HtmlAgriSymbols

        //Received all Agri Symbols        		
	}
	else if(_data.Type == 9){                
       //Received Quote
       document.getElementById("qoute").innerHTML = _data.Quote.Symbol + ' Bid ' + _data.Quote.Bid + ' Offer ' + _data.Quote.Offer;
	}
	else if(_data.Type == 12){     
         //Received all latest Quotes for all symbols
        document.getElementById("ltrades").innerHTML = 'Received Trades ' +  _data.LatestQoutes.length;
	}

});


