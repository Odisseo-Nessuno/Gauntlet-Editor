
var WI=window.innerWidth;
var HE=window.innerHeight;
var down=false;
var grandezza=[];
var create=false;
var mappaProva=[];

iniziale();

var mx=0,my=0;

var mappa= new Terreno(mappaProva);
var oldMap=-1;							// indica che ancora non è stata costruita nessuna mappa

var Wterr=(mappa.map.length)*32 		//stabilite caselle grandi 32 px
var Hterr=(mappa.map[1].length)*32+32

var c=document.getElementById("mainG");

c.width=Wterr;		//horizontal resolution 
c.height=Hterr;		//vertical resolution 
var ctx = c.getContext("2d");

var debug=false;//variabili di debug
var debugP=true;

var noMove=false;

var terrImgs=[] 								// array che contiene tutte le immagini del terreno
var enImgs=[] 									// array che contiene tutte le immagini dei nemici

var mx=500;
var my=500;

function iniziale(){
	grandezza.push(parseInt(prompt("inserisci la larghezza della mappa")));
	grandezza.push(parseInt(prompt("inserisci l'altezza della mappa")));
	var ret=[];
	for(var i=0; i<grandezza[1]; i++){
		var locRet=[]
		for(var j=0; j<grandezza[0];j++){
			locRet[j]=0
		}
		ret[i]=locRet;
	}
	console.log(ret)
	mappaProva=ret;
	loadTImages();
}



function i_prova(){
	////console.log("ok... sono i prova")
	mappa.makeTerr();
	i_update();
}


function i_update(){
	requestAnimationFrame(i_update);
	
}

function loadTImages(){							// callback è la funzione da eseguire al verificarsi di una condizione. nel nostro caso quando si finisce di caricare tutte le immagini.
	var timg = ["imgs/bt.jpg","imgs/bw.jpg"];			//percorso delle immagini, notare che la poszione corrisponde alla "codifica" es: immagine in posizione 0 è il terreno libero, 
	for (var i=0; i< timg.length; i++){					// e nella mappa 0 significa terreno libero
		loadSingleImg(i,timg,loadEImages,0);			// faccio una nuova funzione perchè altrimenti al prossimo ciclo mi sovrascrive l'indice dell'immagine da caricare
	}
}
function loadEImages(callback){							// callback è la funzione da eseguire al verificarsi di una condizione. nel nostro caso quando si finisce di caricare tutte le immagini.
	var timg = ["imgs/boh.png"];								//percorso delle immagini, notare che la poszione corrisponde alla "codifica" es: immagine in posizione 0 è il terreno libero, 
	for (var i=0; i< timg.length; i++){					// e nella mappa 0 significa terreno libero
		loadSingleImg(i,timg,i_prova,1);					// faccio una nuova funzione perchè altrimenti al prossimo ciclo mi sovrascrive l'indice dell'immagine da caricare
	}
}

function loadSingleImg(i,timg,callback,type){		
		var nuovaimg = new Image();
		nuovaimg.src=timg[i];
		////console.log(timg[i]);
		nuovaimg.onload=function(){
			if (type==0){								//if elif servono per decidere in quale array mettere l'immagine caricata
				terrImgs.push(nuovaimg)
				var arrLen=terrImgs.length;
			}
			else if (type==1){
				enImgs.push(nuovaimg)
				var arrLen=enImgs.length;
			}
			////console.log(arrLen)
			if (timg.length==arrLen){					// se ho finito di caricare tutte le immagini procedo :)
				callback();								// in questo caso chiamerò sempre la funzione di init 
			}
			
		};
}


function Terreno(map){			//si assume map matrice
	this.map =map;

	this.makeTerr=function(){
		for (var i=0; i<(this.map.length); i++){
			for(var k=0; k<this.map[i].length; k++){
				this.drawSingleTile(k,i)
			}
		}
	}

	this.drawSingleTile=function(k,i){
				var color ="green"
				switch (this.map[i][k]){
					case 0:
						color="black"
					break;
					case 1:
						color="grey"
					break;
				}
				ctx.fillStyle=color;
				ctx.fillRect(k*32-16,i*32-16,32,32) //per ogni elemento di map disegno l'immagine corrispondente
				if (debug){
					ctx.rect(k*32-16,i*32-16,32,32);
					ctx.stroke();
					ctx.rect(k*32,i*32,2,2)
					ctx.font="10px Georgia";
					//console.log(i)
					ctx.fillText(k+" "+i+".",k*32-8,i*32-16);
				}
	}
}

//funzioni di pubblica utilità
function save(){
	filename =prompt("Inserire Nome Mappa");
	console.log(filename)
	var link;
	c.href = document.getElementById("mainG").toDataURL("image/jpg");
	console.log(c.href)
	c.download= filename+".jpg";
	document.getElementById("save").href=document.getElementById("mainG").toDataURL("image/jpg")
	document.getElementById("save").download=filename;
	alert(getMap(mappa.map))
}			

function tabellizeCoords(x,y,w,h){			//ritorna coordinate sulla tabella partendo dalle x e y attuali
	return ([(((x-w/2)/32).toFixed()),( ((y-h/2)/32 ).toFixed() )]);
}

function getMap(map){
	var str="["
	for(var y=0; y<map.length; y++){
		str+="["
		for(var x=0; x<map[y].length; x++){
				str +=map[y][x]
				if (x!=(map[y].length)-1){
					str +=","
				}
		}
		if (y!=(map.length)-1)
			str +="],"
		else
			str +="]"
	}
	str +="]"
	return str;	
}


function checkCollision(ax,ay,bx,by,wa,wb){			//controlla se il quad con CENTRO in mx my avente l= wa interseca quello in sx sy wb
	var dx = castPositive(ax-bx);
	var dy = castPositive(ay-by);
	var distanzaCasoLimite=wa/2+wb/2;
	return(dx<distanzaCasoLimite && dy<distanzaCasoLimite)
}

function castPositive(a){
	if (a<0)
		return a*-1
	else
		return a
}

function mouseMove(event){
	var x = event.pageX
	var y= event.pageY
	mx= (x/32).toFixed();
	my= (y/32).toFixed();
	if(down==true){
		if(create==false){
			mappa.map[my][mx]=1;
		}
		else
			mappa.map[my][mx]=0;
		mappa.drawSingleTile(mx,my);

	}
	console.log(mx,my)

}

function mouseDown(event){
	down=true;
}
function mouseUp(event){
	down=false;
	console.log("up")
}

function fromDirToRot(dir){	//dir x,y c.e: {-1 0 1}
	var ang=0;

	if(dir[0]<0){
		ang=180;
		if(dir[1]!=0){
			ang=dir[1]*45;
		}
	}
	else{
		ang=dir[1]*90;
	}
	return ang;

}

function go(e){
	var ch= String.fromCharCode(e.keyCode);
	//console.log(ch)
	create=false;
	var pd=[]				//proiettile direzione
	switch (ch){			//trovare soluzione intelligente
		case 'I':
			pd=[0,-1]
			giocatore.direction=pd;
			giocatore.createBullet();
			break;
		case 'K':
			pd=[0,1]
			giocatore.direction=pd;
			giocatore.createBullet();		
			break;
		case 'L':
			pd=[1,0]
			giocatore.direction=pd;
			giocatore.createBullet();
			break;
		case 'J':
			pd=[-1,0]
			giocatore.direction=pd;
			giocatore.createBullet();
			break;			
		case 'X':
			create=true;
		break;						
		case 'S':
			my=1;
			break;
		case 'A':
			mx=-1;
			break;			
		case 'W':
			my=-1;
			break;
		case 'D':
			mx=1;
			break;			
		case 'U':
			document.getElementById("servo").style="z-index:2;";
			break;
		case 'G':
			mappa.save();
			break;			
		case 'I':
			document.getElementById("servo").style="z-index:0;";
			break;			
		case 'Q':
			console.log("Q");
			giocatore.createBullet();
			break;	
		console.log(document.getElementById("servo"))
	}
}

function aCasoBottoni(){
	var dx=0;
	var dy=0;
	if( mx==1)
		dx=1;
	else if(mx==-1)
		dx=-1
	if (my==1)
		dy=1;
	else if(my==-1)
		dy=-1;
	return [dx,dy]
}


function acasoMove(){
	var dx=0;
	var dy=0;
	if( mx>giocatore.x)
		dx=1;
	else if(mx<giocatore.x)
		dx=-1
	if (my>giocatore.y)
		dy=1;
	else if(my<giocatore.y)
		dy=-1;
	return [dx,dy]
}